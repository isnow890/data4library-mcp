import { REGION_CODES, KDC_SUBJECT_CODES } from "../constants/codes.js";
import { z } from "zod";
// Zod 스키마 정의
const getSubjectCodesSchema = z.object({
    majorCode: z.string().optional().describe("대분류 코드 (0-9)"),
});
// 핸들러 생성자
export const createBookToolHandlers = (client) => ({
    searchLibraries: async (args) => {
        return await client.searchLibraries(args);
    },
    searchBooks: async (args) => {
        return await client.searchBooks(args);
    },
    searchPopularBooks: async (args) => {
        return await client.searchPopularBooks(args);
    },
    getBookDetail: async (args) => {
        return await client.getBookDetail(args);
    },
    checkBookAvailability: async (args) => {
        return await client.checkBookAvailability(args);
    },
    getHotTrend: async (args) => {
        return await client.getHotTrend(args);
    },
    searchLibrariesByBook: async (args) => {
        return await client.searchLibrariesByBook(args);
    },
    getUsageTrend: async (args) => {
        return await client.getUsageTrend(args);
    },
    getNewArrivalBooks: async (args) => {
        return await client.getNewArrivalBooks(args);
    },
    getReadingQuantity: async (args) => {
        return await client.getReadingQuantity(args);
    },
    getMonthlyKeywords: async (args) => {
        return await client.getMonthlyKeywords(args);
    },
    searchLibraryCodes: async (args) => {
        return await client.searchLibraryCodes(args);
    },
    getDetailedRegionCodes: async (args) => {
        return await client.getDetailedRegionCodes(args);
    },
    getRegionCodes: async () => {
        return {
            regionCodes: REGION_CODES,
            usage: 'region 파라미터에 코드 값(예: "11", "21")을 사용하세요.',
        };
    },
    getDetailedSubjectCodes: async (args) => {
        return await client.getDetailedSubjectCodes(args);
    },
    getSubjectCodes: async (args) => {
        if (args.majorCode &&
            KDC_SUBJECT_CODES[args.majorCode]) {
            return {
                majorCode: args.majorCode,
                category: KDC_SUBJECT_CODES[args.majorCode],
                usage: 'dtl_kdc 파라미터에 3자리 코드(예: "100", "320")를 사용하세요.',
            };
        }
        return {
            allCodes: KDC_SUBJECT_CODES,
            usage: "kdc 파라미터에 대분류 코드(0-9)를 사용하세요. majorCode를 지정하면 해당 분류의 세부 코드만 조회할 수 있습니다.",
        };
    },
    searchDetailedKDCCodes: async (args) => {
        return await client.searchDetailedKDCCodes(args);
    },
    searchDetailedRegionCodes: async (args) => {
        return await client.searchDetailedRegionCodes(args);
    },
    searchItems: async (args) => {
        return await client.searchItems(args);
    },
    getManiaRecommendations: async (args) => {
        return await client.getManiaRecommendations(args.isbn13);
    },
    getReaderRecommendations: async (args) => {
        return await client.getReaderRecommendations(args.isbn13);
    },
    getBookKeywords: async (args) => {
        return await client.getBookKeywords(args.isbn13, args.additionalYN);
    },
    getBookUsageAnalysis: async (args) => {
        return await client.getBookUsageAnalysis(args.isbn13);
    },
    searchPopularBooksByLibrary: async (args) => {
        return await client.searchPopularBooksByLibrary(args);
    },
    getLibraryInfo: async (args) => {
        return await client.getLibraryInfo(args);
    },
    getPopularBooksByLibrary: async (args) => {
        return await client.getPopularBooksByLibrary(args.libCode);
    },
});
