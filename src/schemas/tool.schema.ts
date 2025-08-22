import { z } from "zod";

/**
 * MCP Tool 정의를 위한 Zod 스키마
 */
export const mcpToolSchema = z.object({
  name: z.string().describe("도구의 고유 이름"),
  description: z.string().describe("도구의 기능 설명"),
  schema: z.any().describe("도구의 입력 파라미터 스키마"),
  handler: z.function().args(z.any(), z.any().optional()).returns(z.promise(z.any())).describe("도구 실행 핸들러 함수")
});

/**
 * MCP Tools 배열 스키마
 */
export const mcpToolsSchema = z.array(mcpToolSchema);

/**
 * MCP Tool 타입 정의
 */
export type McpTool = z.infer<typeof mcpToolSchema>;

/**
 * MCP Tools 배열 타입 정의
 */
export type McpTools = z.infer<typeof mcpToolsSchema>;

/**
 * 검증된 Tools 배열을 생성하는 헬퍼 함수
 */
export function createValidatedTools(tools: McpTool[]): McpTools {
  return mcpToolsSchema.parse(tools);
}

/**
 * Tool 정의를 검증하는 헬퍼 함수
 */
export function validateTool(tool: unknown): McpTool {
  return mcpToolSchema.parse(tool);
}