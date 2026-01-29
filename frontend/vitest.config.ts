import {defineConfig} from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
    plugins:[react()],
    test:{
        globals:true,
        environment:'jsdom',
        setupFiles:'./src/setupTests.ts',
        css:true,
        coverage:{
            provider:'v8',
            reporter:["text", "html", "json"],
            exclude:[
                "node_modules/",
                "src/setupTests.ts",
                "**/*.config.ts",
                "**/*.d.ts"
            ],
        },
    },
    resolve:{
        alias:{
            "@":path.resolve(__dirname,"./src")
        }
    }
})