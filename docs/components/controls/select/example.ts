import { mountUi } from 'tweak-ui'
export default () => {
  const object = { value: 'foo' }
  mountUi('.example-frame', (ui) => {
    ui.select(object, 'value', {
      label: 'Select',
      options: ['foo', 'bar', 'baz', { label: 'a label', value: {} }],
      onchange: console.log,
    })
    ui.select(object, 'value', {
      label: 'Select',
      options: { Foo: 'foo', Bar: 'bar', Baz: 'baz', 'A Label': { some: 'value' } },
      onchange: console.log,
    })
    ui.pre('JSON', () => JSON.stringify(object, null, 2))
  })
}
