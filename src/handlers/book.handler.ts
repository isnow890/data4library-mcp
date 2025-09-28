import { LibraryApiClient } from "../clients/library-api.client.js";
import { REGION_CODES, KDC_SUBJECT_CODES } from "../constants/codes.js";
import { z } from "zod";
import * as schemas from "../schemas/book.schema.js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { addDistanceToLibrary, sortLibrariesByDistance, LibraryWithDistance } from "../utils/location.js";

// CommonJS에서 __dirname 사용 (빌드 시 cjs 포맷)
const __dirname = __filename ? dirname(__filename) : process.cwd();

// Zod 스키마 정의
const getSubjectCodesSchema = z.object({
    majorCode: z.string().optional().describe("대분류 코드 (0-9)"),
});

// 핸들러 생성자
export const createBookToolHandlers = (client: LibraryApiClient) => ({
    searchLibraries: async (args: z.infer<typeof schemas.searchLibrariesSchema>) => {
        return await client.searchLibraries(args);
    },
    searchBooks: async (args: z.infer<typeof schemas.searchBooksSchema>) => {
        return await client.searchBooks(args);
    },
    searchPopularBooks: async (args: z.infer<typeof schemas.searchPopularBooksSchema>) => {
        return await client.searchPopularBooks(args);
    },
    getBookDetail: async (args: z.infer<typeof schemas.getBookDetailSchema>) => {
        return await client.getBookDetail(args);
    },
    checkBookAvailability: async (args: z.infer<typeof schemas.checkBookAvailabilitySchema>) => {
        return await client.checkBookAvailability(args);
    },
    getHotTrend: async (args: z.infer<typeof schemas.getHotTrendSchema>) => {
        return await client.getHotTrend(args);
    },
    searchLibrariesByBook: async (args: z.infer<typeof schemas.searchLibrariesByBookSchema>) => {
        return await client.searchLibrariesByBook(args);
    },
    getUsageTrend: async (args: z.infer<typeof schemas.getUsageTrendSchema>) => {
        return await client.getUsageTrend(args);
    },
    getNewArrivalBooks: async (args: z.infer<typeof schemas.getNewArrivalBooksSchema>) => {
        return await client.getNewArrivalBooks(args);
    },
    getReadingQuantity: async (args: z.infer<typeof schemas.getReadingQuantitySchema>) => {
        return await client.getReadingQuantity(args);
    },
    getMonthlyKeywords: async (args: z.infer<typeof schemas.getMonthlyKeywordsSchema>) => {
        return await client.getMonthlyKeywords(args);
    },
    searchLibraryCodes: async (args: z.infer<typeof schemas.searchLibraryCodesSchema>) => {
        return await client.searchLibraryCodes(args);
    },
    getDetailedRegionCodes: async (args: z.infer<typeof schemas.getDetailedRegionCodesSchema>) => {
        return await client.getDetailedRegionCodes(args);
    },
    getRegionCodes: async () => {
        return {
            regionCodes: REGION_CODES,
            usage: 'region 파라미터에 코드 값(예: "11", "21")을 사용하세요.',
        };
    },
    getDetailedSubjectCodes: async (args: z.infer<typeof schemas.getDetailedSubjectCodesSchema>) => {
        return await client.getDetailedSubjectCodes(args);
    },
    getSubjectCodes: async (args: z.infer<typeof getSubjectCodesSchema>) => {
        if (
            args.majorCode &&
            KDC_SUBJECT_CODES[args.majorCode as keyof typeof KDC_SUBJECT_CODES]
        ) {
            return {
                majorCode: args.majorCode,
                category:
                    KDC_SUBJECT_CODES[args.majorCode as keyof typeof KDC_SUBJECT_CODES],
                usage: 'dtl_kdc 파라미터에 3자리 코드(예: "100", "320")를 사용하세요.',
            };
        }

        return {
            allCodes: KDC_SUBJECT_CODES,
            usage:
                "kdc 파라미터에 대분류 코드(0-9)를 사용하세요. majorCode를 지정하면 해당 분류의 세부 코드만 조회할 수 있습니다.",
        };
    },
    searchDetailedKDCCodes: async (args: z.infer<typeof schemas.searchDetailedKDCCodesSchema>) => {
        return await client.searchDetailedKDCCodes(args);
    },
    searchDetailedRegionCodes: async (args: z.infer<typeof schemas.searchDetailedRegionCodesSchema>) => {
        return await client.searchDetailedRegionCodes(args);
    },
    searchItems: async (args: z.infer<typeof schemas.searchItemsSchema>) => {
        return await client.searchItems(args);
    },
    getManiaRecommendations: async (args: z.infer<typeof schemas.getManiaRecommendationsSchema>) => {
        return await client.getManiaRecommendations(args.isbn13);
    },
    getReaderRecommendations: async (args: z.infer<typeof schemas.getReaderRecommendationsSchema>) => {
        return await client.getReaderRecommendations(args.isbn13);
    },
    getBookKeywords: async (args: z.infer<typeof schemas.getBookKeywordsSchema>) => {
        return await client.getBookKeywords(args.isbn13, args.additionalYN);
    },
    getBookUsageAnalysis: async (args: z.infer<typeof schemas.getBookUsageAnalysisSchema>) => {
        return await client.getBookUsageAnalysis(args.isbn13);
    },
    searchPopularBooksByLibrary: async (args: z.infer<typeof schemas.searchPopularBooksByLibrarySchema>) => {
        return await client.searchPopularBooksByLibrary(args);
    },
    getLibraryInfo: async (args: z.infer<typeof schemas.getLibraryInfoSchema>) => {
        return await client.getLibraryInfo(args);
    },
    getPopularBooksByLibrary: async (args: z.infer<typeof schemas.getPopularBooksByLibrarySchema>) => {
        return await client.getPopularBooksByLibrary(args.libCode);
    },
    searchNearbyLibraries: async (args: { latitude: number; longitude: number; count?: number }) => {
        try {
            // 도서관 데이터 파일 로드
            let librariesData: any[] = [];
            
            const possiblePaths = [
                join(process.cwd(), "dist/data/libraries.json"),
                join(process.cwd(), "dist/src/data/libraries.json"),
                join(process.cwd(), "src/data/libraries.json"),
                join(__dirname, "../data/libraries.json"),
                join(__dirname, "../../data/libraries.json"),
                join(__dirname, "data/libraries.json")
            ];

            let fileLoaded = false;
            let lastError: any;

            for (const filePath of possiblePaths) {
                try {
                    const fileContent = readFileSync(filePath, "utf-8");
                    librariesData = JSON.parse(fileContent);
                    fileLoaded = true;
                    console.error(`[search_nearby_libraries] Successfully loaded data from: ${filePath}`);
                    break;
                } catch (error) {
                    lastError = error;
                    console.error(`[search_nearby_libraries] Failed to load from: ${filePath}`);
                    continue;
                }
            }

            if (!fileLoaded) {
                console.error(`[search_nearby_libraries] All paths failed. CWD: ${process.cwd()}, __dirname: ${__dirname}`);
                throw new Error(`도서관 데이터를 로드할 수 없습니다: ${lastError?.message || 'Unknown error'}`);
            }

            // 각 도서관에 거리 정보 추가
            const librariesWithDistance: LibraryWithDistance[] = [];
            
            for (const library of librariesData) {
                const libraryWithDistance = addDistanceToLibrary(
                    library,
                    args.latitude,
                    args.longitude
                );
                
                if (libraryWithDistance) {
                    librariesWithDistance.push(libraryWithDistance);
                }
            }

            // 거리순으로 정렬
            const sortedLibraries = sortLibrariesByDistance(librariesWithDistance);
            
            // 요청된 개수만큼 반환 (기본값: 15개)
            const count = args.count || 15;
            const nearbyLibraries = sortedLibraries.slice(0, count);

            return {
                success: true,
                userLocation: {
                    latitude: args.latitude,
                    longitude: args.longitude
                },
                totalFound: librariesWithDistance.length,
                returned: nearbyLibraries.length,
                libraries: nearbyLibraries.map(lib => ({
                    libName: lib.libName,
                    region: lib.region,
                    address: lib.address,
                    tel: lib.tel,
                    operatingTime: lib.operatingTime,
                    closed: lib.closed,
                    libCode: lib.libCode,
                    latitude: lib.latitude,
                    longitude: lib.longitude,
                    distance: lib.distance
                }))
            };
        } catch (error) {
            throw new Error(`근처 도서관 검색 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
});
