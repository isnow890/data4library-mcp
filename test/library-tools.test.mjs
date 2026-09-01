import assert from "node:assert/strict";
import { test } from "node:test";
import { LibraryApiClient } from "../dist/src/clients/library-api.client.js";
import { createBookToolHandlers } from "../dist/src/handlers/book.handler.js";

test("임의의 현재 디렉터리에서도 번들된 도서관 데이터를 읽는다", async () => {
  const originalCwd = process.cwd();
  process.chdir("/tmp");
  try {
    const client = new LibraryApiClient({ apiKey: "test-key" });
    const result = await client.searchLibraryCodes({ libraryName: "중앙", limit: 1 });
    assert.match(result.content[0].text, /검색 결과: [1-9]\d*개 도서관 중 1개 표시/);
  } finally {
    process.chdir(originalCwd);
  }
});

test("세부지역 조회가 실제 코드 목록을 반환한다", async () => {
  const client = new LibraryApiClient({ apiKey: "test-key" });
  const result = await client.getDetailedRegionCodes({ region: "11" });
  assert.ok(result.count > 0);
  assert.ok(result.regions.every((region) => region.code.startsWith("11")));
  assert.ok(result.regions.some((region) => region.district === "강남구"));
});

test("세부주제 조회가 API에 사용할 2자리 코드 목록을 반환한다", async () => {
  const client = new LibraryApiClient({ apiKey: "test-key" });
  const result = await client.getDetailedSubjectCodes({ kdc: "8" });
  assert.equal(result.count, 10);
  assert.ok(result.subjects.every((subject) => /^8\d$/.test(subject.code)));
  assert.deepEqual(result.subjectInfo.subcodes, result.subjects.map((subject) => subject.code));
});

test("KDC 대분류 조회도 동일한 2자리 세부코드를 안내한다", async () => {
  const client = new LibraryApiClient({ apiKey: "test-key" });
  const handlers = createBookToolHandlers(client);
  const result = await handlers.getSubjectCodes({ majorCode: "8" });
  assert.ok(result.category.subcodes.every((code) => /^8\d$/.test(code)));
  assert.match(result.usage, /2자리/);
});

test("근처 도서관 검색도 번들된 동일 데이터 정본을 사용한다", async () => {
  const client = new LibraryApiClient({ apiKey: "test-key" });
  const handlers = createBookToolHandlers(client);
  const result = await handlers.searchNearbyLibraries({
    latitude: 37.5665,
    longitude: 126.978,
    count: 1,
  });
  assert.equal(result.success, true);
  assert.equal(result.returned, 1);
  assert.ok(result.totalFound > 0);
});
