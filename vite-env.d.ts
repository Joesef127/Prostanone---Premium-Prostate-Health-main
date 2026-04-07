/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly KORAPAY_PUBLIC_KEY: string
    readonly SHEETS_WEBHOOK_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
