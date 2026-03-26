/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_KORAPAY_PUBLIC_KEY: string
    readonly VITE_ORDERS_WEBHOOK_URL: string
    readonly VITE_SHEETS_WEBHOOK_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
