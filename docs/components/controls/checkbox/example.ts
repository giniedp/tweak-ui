import { binding, mountUi } from 'tweak-ui'

export default () => {
  const object = {
    value: true,
  }
  let value = true
  mountUi('.example-frame', (ui) => {
    ui.bool({
      label: 'Toggle Style',
      value: value,
      toggle: true,
    })
    ui.bool({
      label: 'Checkbox Style',
      value: true,
      toggle: false,
    })

    ui.group('Default Alignment', () => {
      ui.bool({
        value: true,
        onchange: console.log,
      })
      ui.bool(object, 'value', {
        onchange: console.log,
      })
      ui.bool(object, 'value', {
        label: 'Custom label',
        onchange: console.log,
      })
      ui.bool(object, 'value', {
        label: '',
        slotAfter: 'Annotation',
        onchange: console.log,
      })
      ui.bool(object, 'value', {
        readonly: true,
      })
    })

    ui.group('End Alignment', () => {
      ui.bool(object, 'value', {
        label: '',
        align: 'end',
      })

      ui.bool(object, 'value', {
        label: 'Label',
        align: 'end',
      })

      ui.bool(object, 'value', {
        label: 'Label',
        slotBefore: 'Annotation',
        align: 'end',
      })
      ui.bool(object, 'value', {
        label: 'Label',
        align: 'end',
        readonly: true,
      })
    })
  })
}
