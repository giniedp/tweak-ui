<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tweak-ui](./tweak-ui.md) &gt; [ColorPickerModel](./tweak-ui.colorpickermodel.md) &gt; [format](./tweak-ui.colorpickermodel.format.md)

## ColorPickerModel.format property

The format of the string value. Defaults to 'rgb'

<b>Signature:</b>

```typescript
format?: string;
```

## Remarks

This must be a combination of the letters `r`<!-- -->, `g`<!-- -->, `b` and `a`<!-- -->.

A prefix of `#` indicates the input/output is a hex string. e.g. \#rgba

A prefix of `0x` indicates the input is a number. e.g. 0xrgba

A prefix of `[]` indicates the input is an array of numbers. e.g. `[]rgba`

If a prefix is missing `#` is assumed

