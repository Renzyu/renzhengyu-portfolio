import { copyFile, mkdir, writeFile } from "node:fs/promises";

await mkdir("dist/.openai", { recursive: true });
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
await writeFile(
  "dist/server/index.js",
  [
    'import handler from "./index.mjs";',
    "export default {",
    "  fetch(request, env, ctx) {",
    "    return handler(request, env, ctx);",
    "  },",
    "};",
    "",
  ].join("\n"),
  "utf8",
);
