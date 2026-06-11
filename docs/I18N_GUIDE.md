# i18n Guide

## How language switching works

1. Translation JSONs (`en.json`, `th.json`) are imported as ES modules in `useLanguage.ts`
2. Vite bundles them into the main JS chunk at build time — NO separate JSON fetch
3. On language switch: React state updates with new TranslationMap object
4. All components that receive `t` prop re-render with new strings
5. Column headers, filter labels, menu items, page title all update instantly
6. Language preference saved to localStorage key `erp.language`
7. On page load: `useLanguage` reads localStorage, starts with correct language

## How to add a new translatable string

**Step 1:** Add key to `TranslationMap` interface in `frontend/src/types/i18n.ts`  
**Step 2:** Add value in `frontend/src/i18n/en.json`  
**Step 3:** Add value in `frontend/src/i18n/th.json`  
**Step 4:** Pass `t` prop to the component that needs the string  
**Step 5:** Use `t.yourKey` in JSX  

Never write user-visible strings directly in JSX — always use `t.key`

## How to add a third language

**Step 1:** Create `frontend/src/i18n/ar.json` (Arabic example) with same key structure as `en.json`  
**Step 2:** Add `'ar'` to Language type in `useLanguage.ts`  
**Step 3:** Import `ar.json` in `useLanguage.ts`  
**Step 4:** Add `'AR'` button to `LanguageSwitcher.tsx`  

No other changes needed — all components use `t` prop already
