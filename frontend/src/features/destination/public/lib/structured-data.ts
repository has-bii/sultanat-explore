const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sultanatexplore.com"

export function destinationsBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinasi",
        item: `${siteUrl}/destinations`,
      },
    ],
  }
}
