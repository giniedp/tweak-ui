<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tweak-ui](./tweak-ui.md) &gt; [ValueSource](./tweak-ui.valuesource.md)

## ValueSource interface


<b>Signature:</b>

```typescript
export interface ValueSource<T, V> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [property](./tweak-ui.valuesource.property.md) | <code>keyof T</code> | The property name in <code>target</code> where the control value is stored |
|  [target](./tweak-ui.valuesource.target.md) | <code>T</code> | The object which is holding a control value |
|  [value](./tweak-ui.valuesource.value.md) | <code>V</code> | If <code>target</code> and <code>property</code> are not set, then this is used as the control value |
