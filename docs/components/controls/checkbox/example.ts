import { mountUi } from 'tweak-ui'

export default () => {
  const object = {
    value: true,
  }
  mountUi('.example-frame', (ui) => {
    ui.boolean({
      label: 'Toggle Style',
      value: true,
      toggle: true,
    })
    ui.boolean({
      label: 'Checkbox Style',
      value: true,
      toggle: false,
    })

    ui.group('Default Alignment', () => {
      ui.boolean({
        value: true,
        onchange: console.log,
      })
      ui.boolean(object, 'value', {
        onchange: console.log,
      })
      ui.boolean(object, 'value', {
        label: 'Custom label',
        onchange: console.log,
      })
      ui.boolean(object, 'value', {
        label: '',
        text: 'Annotation',
        onchange: console.log,
      })
    })

    ui.group('Start Alignment', () => {
      ui.boolean(object, 'value', {
        label: '',
        align: 'start',
      })

      ui.boolean(object, 'value', {
        label: 'Label',
        align: 'start',
      })

      ui.boolean(object, 'value', {
        label: 'Label',
        align: 'start',
        text: 'Annotation',
      })
    })
  })
}
