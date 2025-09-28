#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { LibraryApiClient } from "./clients/library-api.client.js";
import { registerAllTools } from "./tools/register-tools.js";

// Configuration schema for Smithery
export const configSchema = z.object({
  LIBRARY_API_KEY: z.string().describe("도서관정보나루 API Key"),
});

// Global server instance to prevent memory leaks
let globalServerInstance: McpServer | null = null;

export function createData4LibraryServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  // Reuse existing server instance to prevent memory leaks
  if (globalServerInstance) {
    return globalServerInstance.server;
  }

  console.error("Creating server with config:", {
    LIBRARY_API_KEY: config.LIBRARY_API_KEY ? `[${config.LIBRARY_API_KEY.length} chars]` : "undefined",
  });

  // Create a new MCP server only once
  const server = new McpServer({
    name: "data4library-mcp",
    version: "1.0.0",
  });

  // Initialize client with config
  const client = new LibraryApiClient({
    apiKey: config.LIBRARY_API_KEY || "",
    baseUrl: "http://data4library.kr",
  });

  // Register all tools
  registerAllTools(server, client);

  // Cache the server instance
  globalServerInstance = server;

  return server.server;
}

// Export default for Smithery compatibility
export default createData4LibraryServer;

// Main function to run the server when executed directly
async function main() {
  try {
    console.error("Starting Data4Library MCP Server...");

    // Get config from environment variables - check for empty strings too
    const apiKey = process.env.LIBRARY_API_KEY?.trim();

    console.error("Environment variables:", {
      LIBRARY_API_KEY: process.env.LIBRARY_API_KEY
        ? `[${process.env.LIBRARY_API_KEY.length} chars]`
        : "undefined",
    });

    if (!apiKey) {
      throw new Error(`Missing required environment variables:
        LIBRARY_API_KEY: ${apiKey ? "provided" : "missing"}

        Please set this environment variable before running the server.`);
    }

    const config = {
      LIBRARY_API_KEY: apiKey,
    };

    console.error("Config loaded successfully");

    // Validate config
    const validatedConfig = configSchema.parse(config);
    console.error("Config validated successfully");

    // Create server instance
    const serverFactory = createData4LibraryServer({ config: validatedConfig });
    console.error("Server factory created");

    // Create transport and run server
    const transport = new StdioServerTransport();
    console.error("Transport created, connecting...");

    await serverFactory.connect(transport);
    console.error("Server connected and running");
  } catch (error) {
    console.error("Error in main function:", error);
    throw error;
  }
}

// Run main function if this file is executed directly
// Note: Always run main in CLI mode since this is an MCP server
console.error("Starting MCP server initialization...");
console.error("process.argv:", process.argv);

// Check if running as main module - compatible with both ESM and CommonJS
let isMainModule = false;
try {
  // Try ESM approach first
  if (typeof import.meta !== "undefined" && import.meta.url) {
    console.error("import.meta.url:", import.meta.url);
    isMainModule =
      import.meta.url === `file://${process.argv[1]}` ||
      import.meta.url.endsWith(process.argv[1]) ||
      process.argv[1].endsWith("index.js");
  } else {
    // Fallback for CommonJS or when import.meta is not available
    isMainModule =
      process.argv[1].endsWith("index.js") ||
      process.argv[1].includes("data4library-mcp");
  }

  // Additional check for NPX execution
  if (!isMainModule && process.argv.some(arg => arg.includes('data4library-mcp'))) {
    isMainModule = true;
    console.error("Detected NPX execution, forcing main module mode");
  }
} catch (error) {
  // Fallback for environments where import.meta causes issues
  isMainModule =
    process.argv[1].endsWith("index.js") ||
    process.argv[1].includes("data4library-mcp");
}

console.error("isMainModule:", isMainModule);

if (isMainModule) {
  console.error("Running as main module, starting server...");
  main().catch((error) => {
    console.error("Server failed to start:", error);
    process.exit(1);
  });
} else {
  console.error("Not running as main module, skipping server start");
}