import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export interface LibraryDataRecord {
  code: string;
  name: string;
  address: string;
  tel?: string;
  homepage?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  open_hours?: string;
  closed_info?: string;
}

let cachedLibraries: readonly LibraryDataRecord[] | undefined;

export function loadLibraryData(): readonly LibraryDataRecord[] {
  if (cachedLibraries) {
    return cachedLibraries;
  }

  const dataPath = fileURLToPath(new URL("../data/libraries.json", import.meta.url));
  const parsed: unknown = JSON.parse(readFileSync(dataPath, "utf8"));

  if (!Array.isArray(parsed)) {
    throw new Error("도서관 데이터 형식이 올바르지 않습니다.");
  }

  cachedLibraries = parsed as LibraryDataRecord[];
  return cachedLibraries;
}
