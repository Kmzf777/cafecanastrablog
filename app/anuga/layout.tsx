import type React from "react"

export default function AnugaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`
        body > div > footer,
        body footer.bg-\\[\\#181c23\\] {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  )
}
