interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // agrega aquí otras VITE_... que uses
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}