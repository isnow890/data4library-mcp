import { LibraryApiClient } from "../clients/library-api.client.js";
import { REGION_CODES, KDC_SUBJECT_CODES } from "../constants/codes.js";
import { z } from "zod";
import * as schemas from "../schemas/book.schema.js";

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
});
