# Style

Every built-in control is ultimately just HTML and a small set of CSS classes and custom
properties. This page documents that vocabulary directly, without going through Mithril or
the [UI Builder](/concepts/#ui-builder), so you can reuse the same look for hand-written
markup, server-rendered content, or your own framework's components.

## Root & theme

Any tree of tweak-ui markup must live inside an element with the `tweak-ui` class. It resets
native `input`/`button`/`select` styling, sets the base font and colors, and establishes the
CSS custom properties every other class below relies on.

```html
<div class="tweak-ui">...</div>
```

Two optional modifier classes switch the color theme. Omit both to use the default theme.

```html
<div class="tweak-ui twk-dark">...</div>
<div class="tweak-ui twk-light">...</div>
```

## Design tokens

Sizing, spacing and color are all driven by CSS custom properties, so overriding a handful
of variables re-themes every control at once (see the [Theme](/theme/) page for a live
version of this).

| Variable                                    | Purpose                                      |
| ------------------------------------------- | -------------------------------------------- |
| `--twk-size`                                | Base height for inputs, buttons and rows     |
| `--twk-gap`                                 | Default gap between stacked/inline items     |
| `--twk-inset`                               | Padding of the outer `.tweak-ui` panel       |
| `--twk-radius`                              | Corner radius used across controls           |
| `--twk-label-size`                          | Preferred width of a `.twk-widget-label`     |
| `--twk-input-height` / `-pad-x` / `-pad-y`  | Height/padding of `.twk-input`               |
| `--twk-button-height` / `-pad-x` / `-pad-y` | Height/padding of `.twk-btn`                 |
| `--twk-color-base-100/200/300`              | Panel background shades, darkest to lightest |
| `--twk-color-base-content`                  | Default text color                           |
| `--twk-color-neutral` / `-content`          | Group title background/text                  |
| `--twk-color-accent`                        | Focus, active state and highlight color      |

## Widget rows

`.twk-widget` paired with `.twk-widget-label` is the fundamental "label + content" row used
by almost every built-in control. It's a two-column grid — the label column is fixed by
`--twk-label-size` proportions, the content column takes the rest.

```html
<div class="twk-widget">
  <div class="twk-widget-label">Label</div>
  <div>Any content goes here</div>
</div>
```

Pass `false` for a control's `label` option (in the JS API) to omit the label column
entirely — in raw markup that just means skipping the `.twk-widget-label` element.

## Flex & grid containers

Three small layout primitives cover most container needs:

```html
<div class="twk-flex">...</div>
<!-- column stack, gap between children -->

<div class="twk-flex-row">...</div>
<!-- row of items, gap between children -->

<div class="twk-grid" style="grid-template-columns: repeat(3, 1fr);">...</div>
<!-- css grid, gap between cells -->
```

## Input chrome

`.twk-input` is the pill-shaped container used by text/number/select-style controls. It
handles hover and focus-within states; add `.twk-input-readonly` to present a value without
interactive affordances.

```html
<div class="twk-input">
  <input type="text" value="Hello" />
</div>

<div class="twk-input twk-input-readonly">
  <div class="twk-input-value">Read-only value</div>
</div>
```

## Buttons

`.twk-btn` is the base button look. Combine with modifiers as needed:

| Class             | Effect                              |
| ----------------- | ----------------------------------- |
| `.twk-btn-accent` | Filled with the accent color        |
| `.twk-btn-lg`     | Larger height                       |
| `.twk-btn-sq`     | Square, icon-only button            |
| `.twk-btn-bl`     | Block — full width of its container |

```html
<button class="twk-btn">Default</button>
<button class="twk-btn twk-btn-accent">Accent</button>
<button class="twk-btn twk-btn-sq">×</button>
```

## Checkboxes & toggles

Two `<input type="checkbox">` skins are available; `.twk-bool-input` is the row wrapper that
lays them out (add `.twk-align-end` to push the control to the end of the row).

```html
<div class="twk-bool-input twk-align-end">
  <input type="checkbox" class="twk-check" />
</div>

<div class="twk-bool-input twk-align-end">
  <input type="checkbox" class="twk-toggle" checked />
</div>
```

## Dividers

`.twk-divider` (horizontal) and `.twk-divider-v` (vertical) draw a line, optionally split
around slotted content.

```html
<div class="twk-divider">Section</div>
<div class="twk-divider"></div>
```

## Utility classes

A small set of atomic utilities covers the spacing/color/background needs that come up
repeatedly when composing panels:

- **Spacing** — `.twk-p-{0,1,2,4}`, `.twk-px-*`, `.twk-py-*`, plus semantic aliases
  `.twk-p-inset`, `.twk-px-label`, `.twk-px-input`, `.twk-px-button`
- **Gap** — `.twk-gap-{0,1,2,4}`
- **Size** — `.twk-w-full`, `.twk-w-label`, `.twk-h-input`, `.twk-h-btn`, `.twk-h-full`
- **Radius** — `.twk-rounded-none`, `.twk-rounded`, `.twk-rounded-full`
- **Text** — alignment (`.twk-text-{start,center,end,left,right}`) and size
  (`.twk-text-{xs,sm,md}`)
- **Color** — background (`.twk-bg-{100,200,300,content,neutral,neutral-content,accent}`)
  and text (`.twk-color-{100,200,300,content,neutral,neutral-content,accent,muted,dim}`)
- **Glass** — `.twk-glass` (+ `-100`/`-200`/`-300`) for a translucent, blurred backdrop

Background patterns are useful as placeholders for empty texture/color slots or as a canvas
backdrop; all size from `--twk-pattern-size`:

```html
<div class="twk-bg-checker"></div>
<!-- alpha-channel / empty-slot checkerboard -->

<div class="twk-bg-grid"></div>
<!-- uniform grid lines -->

<div class="twk-bg-grid-axis"></div>
<!-- grid with brighter center axes -->

<div class="twk-bg-dots"></div>
<!-- dot grid -->

<div class="twk-bg-stripes"></div>
<!-- diagonal hazard stripes -->
```

## Putting it together

The following panel is built entirely from the classes above — no Mithril component or the
UI Builder involved, just static HTML.

<div class="tweak-ui">
  <div class="twk-widget">
    <div class="twk-widget-label">Name</div>
    <div class="twk-input">
      <input type="text" value="Tweak UI" />
    </div>
  </div>

  <div class="twk-widget">
    <div class="twk-widget-label">Quality</div>
    <select>
      <option>Low</option>
      <option selected>Medium</option>
      <option>High</option>
    </select>
  </div>

  <div class="twk-widget">
    <div class="twk-widget-label">Version</div>
    <div class="twk-input twk-input-readonly">
      <div class="twk-input-value">v0.8.0</div>
    </div>
  </div>

  <div class="twk-widget">
    <div class="twk-widget-label">Visible</div>
    <div class="twk-bool-input twk-align-end">
      <input type="checkbox" class="twk-toggle" checked />
    </div>
  </div>

  <div class="twk-widget">
    <div class="twk-widget-label">Locked</div>
    <div class="twk-bool-input twk-align-end">
      <input type="checkbox" class="twk-check" />
    </div>
  </div>

  <div class="twk-widget">
    <div class="twk-widget-label">Preview</div>
    <div class="twk-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="twk-bg-checker twk-rounded" style="aspect-ratio: 1;" title="twk-bg-checker"></div>
      <div class="twk-bg-grid twk-rounded" style="aspect-ratio: 1;" title="twk-bg-grid"></div>
      <div class="twk-bg-dots twk-rounded" style="aspect-ratio: 1;" title="twk-bg-dots"></div>
      <div class="twk-bg-stripes twk-rounded" style="aspect-ratio: 1;" title="twk-bg-stripes"></div>
    </div>
  </div>

  <div class="twk-divider">Actions</div>

  <div class="twk-flex-row">
    <button class="twk-btn twk-btn-accent" style="flex: 1;">Save</button>
    <button class="twk-btn" style="flex: 1;">Cancel</button>
    <button class="twk-btn twk-btn-sq" title="More options">&#8942;</button>
  </div>

  <div class="twk-text-sm twk-color-muted">
    Built from plain HTML — no Mithril component involved.
  </div>
</div>
