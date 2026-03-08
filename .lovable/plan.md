

## Plan: Clean up Reviews section background

There are two things making the background look darker/dirtier than the original image:

1. **Dark overlay**: Line 37 has `<div className="absolute inset-0 bg-foreground/30" />` — a 30% dark overlay on top of the background image.
2. **Blur effect**: Line 36 applies `blur-[7.5px]` and `scale-110` to the background image.

### Changes

1. **Remove the dark overlay** (line 37) entirely.
2. **Remove the blur and scale** from the background `<img>` on line 36 — change className from `"absolute inset-0 w-full h-full object-cover blur-[7.5px] scale-110"` to `"absolute inset-0 w-full h-full object-cover"`.

This will let the original WebP image show through cleanly without any darkening or blurring.

