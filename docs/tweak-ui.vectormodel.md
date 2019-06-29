<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tweak-ui](./tweak-ui.md) &gt; [VectorModel](./tweak-ui.vectormodel.md)

## VectorModel interface

Describes a vector picker control

<b>Signature:</b>

```typescript
export interface VectorModel<T = any> extends ControlViewModel, ValueSource<T, Vector> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [disabled](./tweak-ui.vectormodel.disabled.md) | <code>boolean</code> | Disabled the control input |
|  [keys](./tweak-ui.vectormodel.keys.md) | <code>string[]</code> | The vector object field names. Defaults to <code>['x', 'y', 'z']</code> |
|  [max](./tweak-ui.vectormodel.max.md) | <code>number</code> | The max value |
|  [min](./tweak-ui.vectormodel.min.md) | <code>number</code> | The min value |
|  [onChange](./tweak-ui.vectormodel.onchange.md) | <code>(model: VectorModel&lt;T&gt;, value: Vector) =&gt; void</code> | This is called once the control value is committed by the user. |
|  [onInput](./tweak-ui.vectormodel.oninput.md) | <code>(model: VectorModel&lt;T&gt;, value: Vector) =&gt; void</code> | This is called when the control value has been changed. |
|  [step](./tweak-ui.vectormodel.step.md) | <code>number</code> | The step value |
|  [type](./tweak-ui.vectormodel.type.md) | <code>'vector'</code> | The type name of the control |
