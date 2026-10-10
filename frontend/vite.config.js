import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const cspPlugin = (apiOrigin) => ({
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml(html) {
    const csp = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data:",
      `connect-src 'self' ${apiOrigin}`.trim(),
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
    ].join('; ')

    return html.replace(
      '<head>',
      `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`
    )
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  let apiOrigin = ''
  try {
    apiOrigin = new URL(env.VITE_API_URL).origin
  } catch {
    apiOrigin = ''
  }

  return {
    plugins: [react(), cspPlugin(apiOrigin)],
  }
})