/*
Author: Vite
Date Accessed: 11 October 2026
Link: https://vite.dev/guide/api-plugin
Reason: Used to write a custom Vite plugin with transformIndexHtml that injects the Content Security Policy meta tag at build time.
*/

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