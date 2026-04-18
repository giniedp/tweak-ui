import { mountUi } from 'tweak-ui'

export default () => {
  const object = {
    value: true,
  }
  mountUi('.example-frame', (ui) => {
    ui.checkbox({
      value: true,
      onChange: console.log,
      description: 'A control without label',
    })
    ui.checkbox(object, 'value', {
      onChange: console.log,
      description: 'A control with property as label',
    })
    ui.checkbox(object, 'value', {
      label: 'Custom label',
      onChange: console.log,
      description: 'A control with custom label',
    })
    ui.checkbox(object, 'value', {
      label: '',
      text: 'Annotation',
      onChange: console.log,
      description: 'A control with empty label but text annotation',
    })
  })
}
