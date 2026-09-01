import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createData4LibraryServer } from "../dist/src/index.js";

const apiKey = process.env.LIBRARY_API_KEY?.trim();
if (!apiKey) {
  throw new Error("test:live:all 실행에는 LIBRARY_API_KEY가 필요합니다.");
}

const isbn13 = process.env.TEST_ISBN13 ?? "9788936434120";
const libCode = process.env.TEST_LIBRARY_CODE ?? "141591";
const cases = [
  ["search_libraries", { region: "11", pageNo: 1, pageSize: 1 }],
  ["search_books", { title: "소년이 온다", pageNo: 1, pageSize: 1 }],
  ["search_popular_books", { startDt: "2026-08-01", endDt: "2026-08-31", pageNo: 1, pageSize: 1 }],
  ["search_library_codes", { libraryName: "중앙", limit: 1 }],
  ["search_nearby_libraries", { latitude: 37.5665, longitude: 126.978, count: 1 }],
  ["get_book_detail", { isbn13, loaninfoYN: "N" }],
  ["check_book_availability", { libCode, isbn13 }],
  ["get_hot_trend", { searchDt: "2026-08-30" }],
  ["search_libraries_by_book", { isbn: isbn13, region: "11", pageNo: 1, pageSize: 1 }],
  ["get_usage_trend", { libCode, type: "D" }],
  ["get_new_arrival_books", { libCode, searchDt: "2026-08" }],
  ["get_reading_quantity", { region: "11", year: "2025", month: "08" }],
  ["get_monthly_keywords", { month: "2026-08" }],
  ["get_detailed_region_codes", { region: "11" }],
  ["get_region_codes", {}],
  ["get_detailed_subject_codes", { kdc: "8" }],
  ["get_subject_codes", { majorCode: "8" }],
  ["search_detailed_kdc_codes", { majorCode: "8", limit: 1 }],
  ["search_detailed_region_codes", { provinceCode: "11", limit: 1 }],
  ["search_items", { libCode, type: "ALL", isbn13, pageNo: 1, pageSize: 1 }],
  ["get_mania_recommendations", { isbn13 }],
  ["get_reader_recommendations", { isbn13 }],
  ["get_book_keywords", { isbn13, additionalYN: "N" }],
  ["get_book_usage_analysis", { isbn13 }],
  ["search_popular_books_by_library", { libCode, startDt: "2026-08-01", endDt: "2026-08-31", pageNo: 1, pageSize: 1 }],
  ["get_library_info", { libCode, pageNo: 1, pageSize: 1 }],
  ["get_popular_books_by_library", { libCode }],
];

const server = createData4LibraryServer({
  config: { LIBRARY_API_KEY: apiKey },
});
const client = new Client({ name: "live-smoke", version: "1.0.0" });
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

let sourceErrors = 0;
const toolErrors = [];
try {
  for (const [name, args] of cases) {
    const result = await client.callTool(
      { name, arguments: args },
      undefined,
      { timeout: 12_000 },
    );
    if (result.isError || !result.content?.length) {
      toolErrors.push(name);
      continue;
    }

    const text = result.content[0].type === "text" ? result.content[0].text : "";
    try {
      const value = JSON.parse(text);
      if (value?.response?.error) {
        sourceErrors += 1;
      }
    } catch {
      // search_library_codes는 사람이 읽는 텍스트 결과를 직접 반환합니다.
    }
  }

  console.log(
    `27 tools: completed (tool errors: ${toolErrors.length}, source-level no-data responses: ${sourceErrors})`,
  );
  if (toolErrors.length > 0) {
    console.log(`failed tools: ${toolErrors.join(", ")}`);
    process.exitCode = 1;
  }
} finally {
  await client.close();
  await server.close();
}
