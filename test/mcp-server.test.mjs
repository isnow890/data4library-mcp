import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  createData4LibraryServer,
  isDirectExecution,
} from "../dist/src/index.js";
import { registerAllTools } from "../dist/src/tools/register-tools.js";

const EXPECTED_TOOLS = [
  "search_libraries", "search_books", "search_popular_books", "search_library_codes",
  "search_nearby_libraries", "get_book_detail", "check_book_availability", "get_hot_trend",
  "search_libraries_by_book", "get_usage_trend", "get_new_arrival_books", "get_reading_quantity",
  "get_monthly_keywords", "get_detailed_region_codes", "get_region_codes",
  "get_detailed_subject_codes", "get_subject_codes", "search_detailed_kdc_codes",
  "search_detailed_region_codes", "search_items", "get_mania_recommendations",
  "get_reader_recommendations", "get_book_keywords", "get_book_usage_analysis",
  "search_popular_books_by_library", "get_library_info", "get_popular_books_by_library",
].sort();

test("모듈 import는 CLI를 시작하지 않고 argv가 없어도 안전하다", () => {
  assert.equal(isDirectExecution(import.meta.url, ""), false);
});

test("서버 팩토리는 설정별 독립 인스턴스를 생성한다", () => {
  const first = createData4LibraryServer({ config: { LIBRARY_API_KEY: "first" } });
  const second = createData4LibraryServer({ config: { LIBRARY_API_KEY: "second" } });
  assert.notEqual(first, second);
});

test("MCP 프로토콜에 공개 툴 27개를 중복 없이 등록한다", async () => {
  const server = createData4LibraryServer({ config: { LIBRARY_API_KEY: "test-key" } });
  const client = new Client({ name: "test-client", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    const result = await client.listTools();
    const names = result.tools.map((tool) => tool.name).sort();
    assert.deepEqual(names, EXPECTED_TOOLS);
    assert.equal(new Set(names).size, 27);
    assert.equal(client.getServerVersion()?.version, "1.0.6");
  } finally {
    await client.close();
    await server.close();
  }
});

test("MCP 취소 신호를 진행 중 원천 요청까지 전달한다", async () => {
  let resolveStarted;
  let receivedSignal;
  const started = new Promise((resolve) => {
    resolveStarted = resolve;
  });
  const fakeClient = {
    searchLibraries(_args, options) {
      receivedSignal = options.signal;
      resolveStarted();
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener("abort", () => reject(new Error("cancelled")), { once: true });
      });
    },
  };
  const server = new McpServer({ name: "cancel-test", version: "1.0.0" });
  registerAllTools(server, fakeClient);
  const client = new Client({ name: "test-client", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  const controller = new AbortController();

  try {
    const request = client.callTool(
      { name: "search_libraries", arguments: {} },
      undefined,
      { signal: controller.signal, timeout: 1_000 },
    );
    await started;
    controller.abort();
    await assert.rejects(request);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(receivedSignal.aborted, true);
  } finally {
    await client.close();
    await server.close();
  }
});

test("패키지가 빌드 산출물과 로고를 배포 대상으로 선언한다", () => {
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
  assert.equal(packageJson.module, "./dist/src/index.js");
  assert.ok(packageJson.files.includes("assets"));
  assert.equal(packageJson.dependencies.fastmcp, undefined);
  assert.ok(packageJson.dependencies["@modelcontextprotocol/sdk"]);
});
