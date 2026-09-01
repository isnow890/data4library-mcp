import assert from "node:assert/strict";
import { test } from "node:test";
import * as schemas from "../dist/src/schemas/book.schema.js";

test("ISBN 형식을 검증하고 추천도서의 다중 ISBN은 유지한다", () => {
  assert.equal(schemas.checkBookAvailabilitySchema.safeParse({ libCode: "141591", isbn13: "9788936434120" }).success, true);
  assert.equal(schemas.checkBookAvailabilitySchema.safeParse({ libCode: "141591", isbn13: "123" }).success, false);
  assert.equal(schemas.getManiaRecommendationsSchema.safeParse({ isbn13: "9788936434120;8936434128" }).success, true);
  assert.equal(schemas.getManiaRecommendationsSchema.safeParse({ isbn13: "invalid" }).success, false);
});

test("달력에 없는 날짜와 잘못된 월을 거부한다", () => {
  assert.equal(schemas.getHotTrendSchema.safeParse({ searchDt: "2026-02-28" }).success, true);
  assert.equal(schemas.getHotTrendSchema.safeParse({ searchDt: "2026-02-30" }).success, false);
  assert.equal(schemas.getMonthlyKeywordsSchema.safeParse({ month: "2026-13" }).success, false);
});

test("페이지와 결과 개수에 상한을 적용한다", () => {
  assert.equal(schemas.searchLibrariesSchema.safeParse({ pageNo: 1, pageSize: 1000 }).success, true);
  assert.equal(schemas.searchLibrariesSchema.safeParse({ pageNo: 0 }).success, false);
  assert.equal(schemas.searchLibrariesSchema.safeParse({ pageSize: 1001 }).success, false);
  assert.equal(schemas.searchLibraryCodesSchema.safeParse({ limit: 101 }).success, false);
});

test("공식 세부지역·세부주제와 신규 연령 코드를 허용한다", () => {
  assert.equal(schemas.searchPopularBooksSchema.safeParse({ region: "11", dtl_region: "11110", dtl_kdc: "81", age: "a14" }).success, true);
  assert.equal(schemas.searchPopularBooksSchema.safeParse({ region: "99" }).success, false);
  assert.equal(schemas.searchPopularBooksSchema.safeParse({ dtl_kdc: "810" }).success, false);
});
