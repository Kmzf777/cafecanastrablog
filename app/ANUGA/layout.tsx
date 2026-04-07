import type React from "react"
import { Nunito_Sans } from "next/font/google"

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export default function AnugaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={nunito.variable}>
      <style>{`
        body > div > footer,
        body footer.bg-\\[\\#181c23\\] {
          display: none !important;
        }
        .anuga-page,
        .anuga-page *,
        .anuga-display {
          font-family: var(--font-nunito), system-ui, sans-serif;
        }
      `}</style>
      {children}
    </div>
  )
}
