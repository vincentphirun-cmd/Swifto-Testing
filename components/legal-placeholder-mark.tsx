/** Inline marker for legal copy that still needs to be filled in before launch. */
export function LegalPlaceholderMark({ children }: { children: React.ReactNode }) {
  return (
    <mark
      className="rounded px-1.5 py-0.5 bg-amber-100 text-amber-950 border border-amber-300 font-semibold not-italic"
      title="Replace this placeholder before launch"
    >
      {children}
    </mark>
  )
}
