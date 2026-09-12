export function useJsonld(jsonld: () => Record<string, any>) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: () => JSON.stringify(jsonld()),
      },
    ],
  })
}