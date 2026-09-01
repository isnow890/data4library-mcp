import { LibraryApiClient } from "../clients/library-api.client.js";
import { REGION_CODES, KDC_SUBJECT_CODES } from "../constants/codes.js";
import { z } from "zod";
import * as schemas from "../schemas/book.schema.js";
import { addDistanceToLibrary, sortLibrariesByDistance, LibraryWithDistance } from "../utils/location.js";
import { loadLibraryData } from "../utils/library-data.js";

// Zod 스키마 정의
const getSubjectCodesSchema = z.object({
    majorCode: z.string().optional().describe("대분류 코드 (0-9)"),
});

// 핸들러 생성자
export const createBookToolHandlers = (client: LibraryApiClient) => ({
    searchLibraries: async (args: z.infer<typeof schemas.searchLibrariesSchema>, signal?: AbortSignal) => {
        return await client.searchLibraries(args, { signal });
    },
    searchBooks: async (args: z.infer<typeof schemas.searchBooksSchema>, signal?: AbortSignal) => {
        return await client.searchBooks(args, { signal });
    },
    searchPopularBooks: async (args: z.infer<typeof schemas.searchPopularBooksSchema>, signal?: AbortSignal) => {
        return await client.searchPopularBooks(args, { signal });
    },
    getBookDetail: async (args: z.infer<typeof schemas.getBookDetailSchema>, signal?: AbortSignal) => {
        return await client.getBookDetail(args, { signal });
    },
    checkBookAvailability: async (args: z.infer<typeof schemas.checkBookAvailabilitySchema>, signal?: AbortSignal) => {
        return await client.checkBookAvailability(args, { signal });
    },
    getHotTrend: async (args: z.infer<typeof schemas.getHotTrendSchema>, signal?: AbortSignal) => {
        return await client.getHotTrend(args, { signal });
    },
    searchLibrariesByBook: async (args: z.infer<typeof schemas.searchLibrariesByBookSchema>, signal?: AbortSignal) => {
        return await client.searchLibrariesByBook(args, { signal });
    },
    getUsageTrend: async (args: z.infer<typeof schemas.getUsageTrendSchema>, signal?: AbortSignal) => {
        return await client.getUsageTrend(args, { signal });
    },
    getNewArrivalBooks: async (args: z.infer<typeof schemas.getNewArrivalBooksSchema>, signal?: AbortSignal) => {
        return await client.getNewArrivalBooks(args, { signal });
    },
    getReadingQuantity: async (args: z.infer<typeof schemas.getReadingQuantitySchema>, signal?: AbortSignal) => {
        return await client.getReadingQuantity(args, { signal });
    },
    getMonthlyKeywords: async (args: z.infer<typeof schemas.getMonthlyKeywordsSchema>, signal?: AbortSignal) => {
        return await client.getMonthlyKeywords(args, { signal });
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
                usage: 'dtl_kdc 파라미터에 2자리 코드(예: "81", "32")를 사용하세요.',
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
    searchItems: async (args: z.infer<typeof schemas.searchItemsSchema>, signal?: AbortSignal) => {
        return await client.searchItems(args, { signal });
    },
    getManiaRecommendations: async (args: z.infer<typeof schemas.getManiaRecommendationsSchema>, signal?: AbortSignal) => {
        return await client.getManiaRecommendations(args.isbn13, { signal });
    },
    getReaderRecommendations: async (args: z.infer<typeof schemas.getReaderRecommendationsSchema>, signal?: AbortSignal) => {
        return await client.getReaderRecommendations(args.isbn13, { signal });
    },
    getBookKeywords: async (args: z.infer<typeof schemas.getBookKeywordsSchema>, signal?: AbortSignal) => {
        return await client.getBookKeywords(args.isbn13, args.additionalYN, { signal });
    },
    getBookUsageAnalysis: async (args: z.infer<typeof schemas.getBookUsageAnalysisSchema>, signal?: AbortSignal) => {
        return await client.getBookUsageAnalysis(args.isbn13, { signal });
    },
    searchPopularBooksByLibrary: async (args: z.infer<typeof schemas.searchPopularBooksByLibrarySchema>, signal?: AbortSignal) => {
        return await client.searchPopularBooksByLibrary(args, { signal });
    },
    getLibraryInfo: async (args: z.infer<typeof schemas.getLibraryInfoSchema>, signal?: AbortSignal) => {
        return await client.getLibraryInfo(args, { signal });
    },
    getPopularBooksByLibrary: async (args: z.infer<typeof schemas.getPopularBooksByLibrarySchema>, signal?: AbortSignal) => {
        return await client.getPopularBooksByLibrary(args.libCode, { signal });
    },
    searchNearbyLibraries: async (args: { latitude: number; longitude: number; count?: number }) => {
        try {
            const librariesData = loadLibraryData();

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
                    libName: lib.name,
                    region: lib.address.split(' ').slice(0, 2).join(' '), // Extract region from address
                    address: lib.address,
                    tel: lib.tel,
                    operatingTime: lib.open_hours,
                    closed: lib.closed_info,
                    libCode: lib.code,
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


