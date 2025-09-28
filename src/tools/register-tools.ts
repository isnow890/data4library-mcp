import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as schemas from "../schemas/book.schema.js";
import { createBookToolHandlers } from "../handlers/book.handler.js";
import { LibraryApiClient } from "../clients/library-api.client.js";

export function registerAllTools(server: McpServer, client: LibraryApiClient) {
  const handlers = createBookToolHandlers(client);

  // Register all tools
  server.registerTool(
    "search_libraries",
    {
      description: "전국의 공공도서관 정보를 검색합니다.",
      inputSchema: schemas.searchLibrariesSchema.shape,
    },
    async (args) => {
      const result = await handlers.searchLibraries(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_books",
    {
      description: "도서관 소장 도서를 검색합니다.",
      inputSchema: schemas.searchBooksSchema.shape,
    },
    async (args) => {
      const result = await handlers.searchBooks(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_popular_books",
    {
      description: "인기대출도서를 조회합니다.",
      inputSchema: schemas.searchPopularBooksSchema.shape,
    },
    async (args) => {
      const result = await handlers.searchPopularBooks(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_library_codes",
    {
      description: "도서관명이나 지역명으로 도서관 코드를 검색합니다.",
      inputSchema: schemas.searchLibraryCodesSchema.shape,
    },
(async (args: any) => {
      return await handlers.searchLibraryCodes(args);
    }) as any
  );

  server.registerTool(
    "search_nearby_libraries",
    {
      description: "사용자의 위치를 기반으로 가까운 도서관들을 거리순으로 검색합니다.",
      inputSchema: schemas.searchNearbyLibrariesSchema.shape,
    },
    async (args) => {
      const result = await handlers.searchNearbyLibraries(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_book_detail",
    {
      description: "ISBN으로 도서의 상세 정보를 조회합니다.",
      inputSchema: schemas.getBookDetailSchema.shape,
    },
    async (args) => {
      const result = await handlers.getBookDetail(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "check_book_availability",
    {
      description: "특정 도서관에서 도서의 소장여부 및 대출 가능여부를 조회합니다.",
      inputSchema: schemas.checkBookAvailabilitySchema.shape,
    },
    async (args) => {
      const result = await handlers.checkBookAvailability(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_hot_trend",
    {
      description: "대출 급상승 도서를 조회합니다.",
      inputSchema: schemas.getHotTrendSchema.shape,
    },
    async (args) => {
      const result = await handlers.getHotTrend(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_libraries_by_book",
    {
      description: "특정 도서를 소장한 도서관을 검색합니다.",
      inputSchema: schemas.searchLibrariesByBookSchema.shape,
    },
    async (args) => {
      const result = await handlers.searchLibrariesByBook(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_usage_trend",
    {
      description: "도서관별 대출반납 추이를 조회합니다.",
      inputSchema: schemas.getUsageTrendSchema.shape,
    },
    async (args) => {
      const result = await handlers.getUsageTrend(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_new_arrival_books",
    {
      description: "도서관별 신착도서를 조회합니다.",
      inputSchema: schemas.getNewArrivalBooksSchema.shape,
    },
    async (args) => {
      const result = await handlers.getNewArrivalBooks(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_reading_quantity",
    {
      description: "지역별 독서량/독서율을 조회합니다.",
      inputSchema: schemas.getReadingQuantitySchema.shape,
    },
    async (args) => {
      const result = await handlers.getReadingQuantity(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_monthly_keywords",
    {
      description: "이달의 키워드를 조회합니다.",
      inputSchema: schemas.getMonthlyKeywordsSchema.shape,
    },
    async (args) => {
      const result = await handlers.getMonthlyKeywords(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_detailed_region_codes",
    {
      description: "세부지역 코드를 조회합니다.",
      inputSchema: schemas.getDetailedRegionCodesSchema.shape,
    },
    async (args) => {
      const result = await handlers.getDetailedRegionCodes(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_region_codes",
    {
      description: "지역 코드 목록을 조회합니다.",
      inputSchema: z.object({}).shape,
    },
    async () => {
      const result = await handlers.getRegionCodes();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_detailed_subject_codes",
    {
      description: "세부주제 코드를 조회합니다.",
      inputSchema: schemas.getDetailedSubjectCodesSchema.shape,
    },
    async (args) => {
      const result = await handlers.getDetailedSubjectCodes(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_subject_codes",
    {
      description: "KDC 대주제분류 코드 목록을 조회합니다.",
      inputSchema: z.object({
        majorCode: z.string().optional().describe("대분류 코드 (0-9)"),
      }).shape,
    },
    async (args) => {
      const result = await handlers.getSubjectCodes(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_detailed_kdc_codes",
    {
      description: "세부주제코드를 검색합니다.",
      inputSchema: schemas.searchDetailedKDCCodesSchema.shape,
    },
    async (args) => {
      const result = await handlers.searchDetailedKDCCodes(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_detailed_region_codes",
    {
      description: "세부지역코드를 검색합니다.",
      inputSchema: schemas.searchDetailedRegionCodesSchema.shape,
    },
    async (args) => {
      const result = await handlers.searchDetailedRegionCodes(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_items",
    {
      description: "도서관별 장서/대출 데이터를 조회합니다.",
      inputSchema: schemas.searchItemsSchema.shape,
    },
    async (args) => {
      const result = await handlers.searchItems(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_mania_recommendations",
    {
      description: "마니아 추천도서를 조회합니다.",
      inputSchema: schemas.getManiaRecommendationsSchema.shape,
    },
    async (args) => {
      const result = await handlers.getManiaRecommendations(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_reader_recommendations",
    {
      description: "다독자 추천도서를 조회합니다.",
      inputSchema: schemas.getReaderRecommendationsSchema.shape,
    },
    async (args) => {
      const result = await handlers.getReaderRecommendations(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_book_keywords",
    {
      description: "도서 키워드 목록을 조회합니다.",
      inputSchema: schemas.getBookKeywordsSchema.shape,
    },
    async (args) => {
      const result = await handlers.getBookKeywords(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_book_usage_analysis",
    {
      description: "도서별 이용 분석을 조회합니다.",
      inputSchema: schemas.getBookUsageAnalysisSchema.shape,
    },
    async (args) => {
      const result = await handlers.getBookUsageAnalysis(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_popular_books_by_library",
    {
      description: "도서관/지역별 인기대출 도서를 조회합니다.",
      inputSchema: schemas.searchPopularBooksByLibrarySchema.shape,
    },
    async (args) => {
      const result = await handlers.searchPopularBooksByLibrary(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_library_info",
    {
      description: "도서관별 통합정보를 조회합니다.",
      inputSchema: schemas.getLibraryInfoSchema.shape,
    },
    async (args) => {
      const result = await handlers.getLibraryInfo(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_popular_books_by_library",
    {
      description: "도서관별 인기대출도서를 조회합니다.",
      inputSchema: schemas.getPopularBooksByLibrarySchema.shape,
    },
    async (args) => {
      const result = await handlers.getPopularBooksByLibrary(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}