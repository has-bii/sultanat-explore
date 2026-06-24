const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sultanatexplore.com"

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

export function citiesItemListJsonLd(
  cities: { slug: string; name: string; image: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cities.map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: city.name,
      url: `${siteUrl}/destinations/${city.slug}`,
      image: city.image || undefined,
    })),
  }
}
