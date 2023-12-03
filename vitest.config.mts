import { defineConfig } from "vitest/dist/config";

export default defineConfig({
    test: {
        setupFiles: ["./tests/setup.ts"]
    }
})