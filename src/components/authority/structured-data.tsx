interface JsonLdProps {
  data: object | object[]
  id: string
}

export function JsonLd({ data, id }: JsonLdProps) {
  const array = Array.isArray(data) ? data : [data]
  return (
    <>
      {array.map((entry, index) => (
        <script
          key={`${id}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  )
}
