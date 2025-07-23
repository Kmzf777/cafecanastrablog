import { NextResponse } from 'next/server'

export async function GET() {
  const verificationCode = 'N8TasACAZl8du6bWXtBGCGaWHXM2EMe6GEepmTpKi28'
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Google Site Verification</title>
  <meta name="google-site-verification" content="${verificationCode}" />
</head>
<body>
  <h1>Google Site Verification</h1>
  <p>Verification code: ${verificationCode}</p>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
} 