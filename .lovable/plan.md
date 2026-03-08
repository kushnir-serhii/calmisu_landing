

## Footer -- Figma-to-code alignment

After reading the Figma HTML, here are the differences from the current `Footer.tsx`:

### What the Figma specifies
- **Container**: `padding-top: 64px`, `gap: 80px`, `bg: #F4F4F5`, `overflow: hidden`, `height: 545px`
- **Nav row**: `width: 1121px`, `justify-content: space-between` (not centered with gaps)
- **"Calmisu" text**: `font-size: 335px`, `line-height: 150%`, `color: #E8E8EA`, `height: 489px`
- **Bamboo image**: `width: 1440px`, `height: 353px`, `bottom: -27px` (slightly pushed down to crop the bottom)

### What needs to change

1. **Gap between nav and text**: Change from `mt-12 md:mt-20` to a proper `gap-20` (80px) on the parent flex container
2. **Nav links layout**: Use `justify-between` instead of `justify-center gap-8 md:gap-16` for proper spacing
3. **Calmisu text**: Set `leading-[150%]` and constrain height to `h-[489px]` on desktop so it clips properly with the bamboo
4. **Bamboo image**: Position with `bottom: -27px` instead of negative margin top, and set explicit dimensions
5. **Overall container**: Add `max-h` or fixed height behavior so the bamboo overlaps/crops at the bottom edge

### Files to edit
- `src/components/Footer.tsx` -- restructure layout to match Figma specs exactly

