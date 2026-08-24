import { defineConfig } from "tsup"

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"migrations/runMigrations": "src/migrations/runMigrations.ts"
	},
	format: ["esm"],
	target: "node22",
	outDir: "dist",
	clean: true,
	noExternal: [/^@notas-universitarias\//]
})
