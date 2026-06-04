---
date: 2026-06-04
title: Admin Dashboard Layout & Client Infrastructure
tags: [admin, sidebar, react-query, provider, infrastructure]
---

- **Decision:** Replaced old empty admin layout with shadcn SidebarProvider + AppSidebar layout
- **Decision:** Added React Query (@tanstack/react-query) for client-side data fetching with DevTools
- **Decision:** Added next-themes and sonner for theme and toast notification infrastructure
- **Decision:** Created RootProviders wrapping TooltipProvider, QueryProvider, and Toaster in root layout
- **Decision:** Fixed root layout lang to "id" (Bahasa Indonesia)
- **Decision:** Restructured admin dashboard page to use new MainPage/Header/Breadcrumb components
- **Reason:** Prepare admin dashboard for full-featured CRUD pages with proper layout, data fetching, notifications, and theme support
