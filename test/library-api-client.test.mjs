import assert from "node:assert/strict";
import { createServer } from "node:http";
import { afterEach, test } from "node:test";
import {
  Data4LibraryRequestError,
  LibraryApiClient,
} from "../dist/src/clients/library-api.client.js";

const servers = new Set();

async function startServer(handler) {
  const server = createServer(handler);
  servers.add(server);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return `http://127.0.0.1:${address.port}`;
}

afterEach(async () => {
  for (const server of servers) {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
  }
  servers.clear();
});

test("API 키를 입력 객체를 변경하지 않고 요청에만 추가한다", async () => {
  let requestedUrl;
  const baseUrl = await startServer((request, response) => {
    requestedUrl = new URL(request.url, baseUrl);
    response.setHeader("content-type", "application/json");
    response.end('{"response":{"numFound":0}}');
  });
  const client = new LibraryApiClient({ apiKey: "test-key", baseUrl, timeoutMs: 1_000 });
  const params = { region: "11" };

  await client.searchLibraries(params);

  assert.deepEqual(params, { region: "11" });
  assert.equal(requestedUrl.pathname, "/api/libSrch");
  assert.equal(requestedUrl.searchParams.get("authKey"), "test-key");
  assert.equal(requestedUrl.searchParams.get("format"), "json");
});

test("외부 평문 HTTP 주소를 거부한다", () => {
  assert.throws(
    () => new LibraryApiClient({ apiKey: "test-key", baseUrl: "http://data4library.kr" }),
    /HTTPS/,
  );
});

test("오류 로그와 예외에 API 키를 포함하지 않는다", async () => {
  const baseUrl = await startServer((_request, response) => {
    response.statusCode = 500;
    response.end("failure");
  });
  const secret = "never-log-this-key";
  const client = new LibraryApiClient({ apiKey: secret, baseUrl, timeoutMs: 1_000 });
  const logs = [];
  const originalError = console.error;
  console.error = (...args) => logs.push(args);

  try {
    await assert.rejects(
      client.searchLibraries({ region: "11" }),
      (error) => error instanceof Data4LibraryRequestError && error.status === 500,
    );
  } finally {
    console.error = originalError;
  }

  assert.doesNotMatch(JSON.stringify(logs), new RegExp(secret));
});

test("응답이 멈추면 설정한 시간 안에 종료한다", async () => {
  const baseUrl = await startServer(() => {});
  const client = new LibraryApiClient({ apiKey: "test-key", baseUrl, timeoutMs: 50 });
  const originalError = console.error;
  console.error = () => {};
  const startedAt = Date.now();

  try {
    await assert.rejects(
      client.searchLibraries(),
      (error) => error instanceof Data4LibraryRequestError && /시간 초과/.test(error.message),
    );
  } finally {
    console.error = originalError;
  }

  assert.ok(Date.now() - startedAt < 500);
});

test("호출자의 AbortSignal로 진행 중 요청을 취소한다", async () => {
  const baseUrl = await startServer(() => {});
  const client = new LibraryApiClient({ apiKey: "test-key", baseUrl, timeoutMs: 1_000 });
  const controller = new AbortController();
  const originalError = console.error;
  console.error = () => {};
  const request = client.searchLibraries({}, { signal: controller.signal });
  controller.abort();

  try {
    await assert.rejects(
      request,
      (error) => error instanceof Data4LibraryRequestError && /요청 취소/.test(error.message),
    );
  } finally {
    console.error = originalError;
  }
});
