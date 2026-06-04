---
date: 2026-06-04
title: Destination Schema Design
tags: [prisma, database, schema, destination, attraction]
---

- **Decision:** `Destination` = City model with `imageId` FK to `Image`, `highlights` as `String[]`
- **Decision:** `Attraction` = Landmark/activity with `imageId`, `categoryId`, `destinationId` FKs
- **Decision:** `AttractionCategory` = Category entity table (budaya, alam, pantai), not enum
- **Decision:** `Image` = Reusable base model with `url`, `alt` — no polymorphic relations
- **Decision:** Gallery images via join tables (`DestinationImage`, `AttractionImage`) with `order` field
- **Reason:** Categories belong to attractions, not destinations. Each city has many attractions, each attraction has one category. Image model reusable across entities via typed FKs and join tables.
