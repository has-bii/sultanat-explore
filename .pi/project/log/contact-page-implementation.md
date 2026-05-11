---
date: 2026-05-12
title: Contact Page Implementation
tags: [contact, inquiry-form, whatsapp, faq, feature]
---

- **Decision:** Implemented Contact page at `/contact` with split layout — left column (contact cards + operating hours), right column (inquiry form)
- **Decision:** Inquiry form submits via WhatsApp pre-filled message (no backend). Fields: name, email, subject (dropdown), message
- **Decision:** Added FAQ mini-section with 4 contact-related accordion items below main content
- **Decision:** Hero uses dark gradient style matching About Us page, with navbar color inversion sentinel
- **Reason:** PRD §5.10 specifies WhatsApp as primary contact, social links, email, optional inquiry form. User chose split layout, WA-based form, operating hours, FAQ mini, dark hero
