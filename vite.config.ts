import { builtinModules } from "node:module";
import path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

import { defineConfig } from "vite";

import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import tsconfig from "vite-plugin-tsconfig-paths";
import terser from "@rollup/plugin-terser";
import dts from "vite-plugin-dts";

const IS_DEV = process.env.npm_lifecycle_event === "dev";

let i = 0;

export default defineConfig({
    build: {
        target: ["esnext"],
        lib: {
            entry: [path.resolve(__dirname, "src/index.ts"), path.resolve(__dirname, "src/bin.ts")],
            formats: ["es", "cjs"],
            fileName: (format) => {
                i++;

                return `${i % 2 === 0 ? "index" : "bin"}.${format == "es" ? "js" : format}`;
            },
        },
        outDir: "dist",
        rollupOptions: {
            external: [...builtinModules],
            // @ts-expect-error
            plugins: [!IS_DEV && terser({}), preserveShebangs()].filter(Boolean),
        },
    },
    plugins: [
        dts({
            exclude: ["test/**/*"],
        }),
        tsconfig(),
    ],
});
