# TextNumberField — 2026-06-18

## Problem

`TextField` always calls `field.handleChange(e.target.value)` → string. Schema fields typed as `number` (e.g. `price`) break — value stored as string, validation fails or type mismatch.

## Solution

Added `TextNumberField` to `frontend/src/lib/form.tsx`:

- Input `type="number"`
- `onChange` parses: `Number(v)`, empty → `0`
- Keeps `field.handleChange` receiving `number`
- Registered in `baseFieldComponents`

## Files Changed

- `frontend/src/lib/form.tsx` — added `TextNumberField` component + export
- `frontend/src/features/open-trip/components/form/index.tsx` — `price` field switched to `TextNumberField`
