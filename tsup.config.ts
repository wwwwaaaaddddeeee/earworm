import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    external: ["react", "react-dom"],
    clean: true,
  },
  {
    entry: ["src/api.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: false,
  },
]);
