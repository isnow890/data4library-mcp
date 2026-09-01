import { cpSync } from "node:fs";

cpSync("src/data", "dist/src/data", { recursive: true });
cpSync("src/data", "dist/data", { recursive: true });
