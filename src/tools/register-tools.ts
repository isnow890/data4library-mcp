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

  // Add other essential tools only
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
}