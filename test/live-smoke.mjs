import { LibraryApiClient } from "../dist/src/clients/library-api.client.js";

const apiKey = process.env.LIBRARY_API_KEY?.trim();
if (!apiKey) {
  throw new Error("test:live 실행에는 LIBRARY_API_KEY가 필요합니다.");
}

const client = new LibraryApiClient({ apiKey, timeoutMs: 8_000 });
const isbn13 = process.env.TEST_ISBN13 ?? "9788936434120";
const libCode = process.env.TEST_LIBRARY_CODE ?? "141591";
const checks = [
  ["libSrch", () => client.searchLibraries({ region: "11", pageNo: 1, pageSize: 1 })],
  ["bookExist", () => client.checkBookAvailability({ libCode, isbn13 })],
  ["libSrchByBook", () => client.searchLibrariesByBook({ isbn: isbn13, region: "11", pageNo: 1, pageSize: 1 })],
];

for (const [name, run] of checks) {
  const startedAt = Date.now();
  const result = await run();
  if (result?.response?.error) {
    throw new Error(`${name} 원천 오류`);
  }
  console.log(`${name}: ok (${Date.now() - startedAt}ms)`);
}
