/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_E2E: '0' | '1'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
