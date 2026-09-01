#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  DEFAULT_API_TIMEOUT_MS,
  LibraryApiClient,
} from "./clients/library-api.client.js";
import { registerAllTools } from "./tools/register-tools.js";

export const configSchema = z.object({
  LIBRARY_API_KEY: z.string().trim().min(1).describe("도서관정보나루 API Key"),
  LIBRARY_API_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(50)
    .max(60_000)
    .default(DEFAULT_API_TIMEOUT_MS),
});

export function createData4LibraryServer({
  config,
}: {
  config: z.input<typeof configSchema>;
}) {
  const validatedConfig = configSchema.parse(config);
  const server = new McpServer({
    name: "data4library-mcp",
    version: "1.0.6",
  });

  const client = new LibraryApiClient({
    apiKey: validatedConfig.LIBRARY_API_KEY,
    baseUrl: "https://data4library.kr",
    timeoutMs: validatedConfig.LIBRARY_API_TIMEOUT_MS,
  });

  registerAllTools(server, client);
  return server.server;
}

export async function main() {
  try {
    const apiKey = process.env.LIBRARY_API_KEY?.trim();

    if (!apiKey) {
      throw new Error("LIBRARY_API_KEY 환경변수가 필요합니다.");
    }

    const validatedConfig = configSchema.parse({
      LIBRARY_API_KEY: apiKey,
      LIBRARY_API_TIMEOUT_MS: process.env.LIBRARY_API_TIMEOUT_MS,
    });

    const serverFactory = createData4LibraryServer({ config: validatedConfig });
    const transport = new StdioServerTransport();
    await serverFactory.connect(transport);
    console.error("Data4Library MCP server started");
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    console.error(`Data4Library MCP server failed: ${message}`);
    throw error;
  }
}

export function isDirectExecution(
  moduleUrl: string = import.meta.url,
  entryPath: string | undefined = process.argv[1],
): boolean {
  if (!entryPath) {
    return false;
  }

  try {
    return realpathSync(fileURLToPath(moduleUrl)) === realpathSync(entryPath);
  } catch {
    return false;
  }
}

if (isDirectExecution()) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    console.error(`Server failed to start: ${message}`);
    process.exit(1);
  });
}
