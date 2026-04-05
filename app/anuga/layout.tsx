import type React from "react"
import { Outfit, DM_Sans } from "next/font/google"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export default function AnugaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${outfit.variable} ${dmSans.variable}`}>
      <style>{`
        body > div > footer,
        body footer.bg-\\[\\#181c23\\] {
          display: none !important;
        }
        .anuga-page * {
          font-family: var(--font-dm-sans), system-ui, sans-serif;
        }
        .anuga-page h1,
        .anuga-page h2,
        .anuga-page h3,
        .anuga-page h4 {
          font-family: var(--font-outfit), system-ui, sans-serif;
        }
      `}</style>
      {children}
    </div>
  )
}
