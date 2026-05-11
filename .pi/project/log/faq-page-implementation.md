---
date: 2026-05-12
title: FAQ Page Implementation
tags: [faq, feature, navbar, footer]
---

- **Decision:** Created dedicated `/faq` page with category-filtered accordion (6 categories, ~20 questions)
- **Decision:** Added FAQ nav link to navbar (after About, before Contact) and footer (Company column)
- **Decision:** Feature module at `src/features/faq/` — follows existing feature-folder convention
- **Reason:** FAQ was a section on homepage only. Dedicated page gives more space for comprehensive Q&A organized by topic.
