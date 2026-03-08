

## Plan: Replace PNG images with WebP versions

The user uploaded three WebP images to replace existing assets:

1. **`activities.webp`** → replaces `public/images/activities.png` — used in `FeaturesFlow.tsx`
2. **`illustration_1.webp`** → replaces `public/images/phone-breathe.png` — used in `FeaturesScience.tsx`
3. **`reviews_bg.webp`** → replaces `public/images/reviews-water-bg.webp` — used in `ReviewsSection.tsx`

### Changes

1. **Copy uploaded assets** to `public/images/`:
   - `user-uploads://activities.webp` → `public/images/activities.webp`
   - `user-uploads://illustration_1.webp` → `public/images/phone-breathe.webp`
   - `user-uploads://reviews_bg.webp` → `public/images/reviews-water-bg.webp`

2. **Update `src/components/FeaturesFlow.tsx`** — change src from `/images/activities.png` to `/images/activities.webp`

3. **Update `src/components/FeaturesScience.tsx`** — change src from `/images/phone-breathe.png` to `/images/phone-breathe.webp`

4. **`ReviewsSection.tsx`** — already references `.webp`, just needs the new file copied over (same filename)

