export function JsonLd({ data }: { data: object[] }) {
  return (
    <>
      {data.map((entry, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}
    </>
  )
}
