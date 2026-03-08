

## Plan: Replace upper activities grid with provided PNG illustration

The user has provided the activities grid illustration as a PNG (`activities.png`). This will replace the current programmatic grid in `FeaturesFlow.tsx` with the single image, matching how the lower section uses `phone-breathe.png`.

### Changes

1. **Copy the uploaded image** to `public/images/activities.png`

2. **Update `src/components/FeaturesFlow.tsx`**: Replace the grid markup (the `bg-brand-light` container with 4 individual card divs) with a single `<img>` tag pointing to the new PNG. Remove `aspect-square` and `bg-brand-light` since the PNG includes its own background. Keep `lg:w-1/2` for consistent 50% width.

Before:
```tsx
<div className="flex w-full lg:w-1/2 aspect-square justify-center items-center rounded-3xl bg-brand-light overflow-hidden shrink-0">
  <div className="grid grid-cols-2 gap-2">
    {/* 4 card divs */}
  </div>
</div>
```

After:
```tsx
<div className="flex w-full lg:w-1/2 justify-center items-end rounded-3xl overflow-hidden shrink-0">
  <img src="/images/activities.png" alt="Calming activities" className="w-full object-contain" loading="lazy" />
</div>
```

This makes both sections visually consistent in how they render their illustrations.

