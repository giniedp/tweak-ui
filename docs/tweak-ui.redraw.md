<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tweak-ui](./tweak-ui.md) &gt; [redraw](./tweak-ui.redraw.md)

## redraw() function

Redraws the ui

<b>Signature:</b>

```typescript
export declare function redraw(): void;
```
<b>Returns:</b>

void

## Remarks

When changing the ui description object qui callbacks (e.g. `onInput` or `onChange`<!-- -->) the ui will redraw automatically.

However if the ui description object is changed from outside the qui callback then this method must be called in order to update the visual state.

