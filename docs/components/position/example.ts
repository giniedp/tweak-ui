import * as TweakUi from 'tweak-ui'

export default () => {

  const context = { value: { x: 0, y: 1, z: 0 } }
  const context3 = { value: [3, 2, 1] }
  TweakUi.mount(".example-frame", (ui) => {
    ui.position(context, 'value', {
      label: 'Vector',
      min: -1, max: 1, step: 0.125,
      onInput: console.log, onChange: console.log
    })

    ui.position(context, 'value', {
      label: 'Vector',
      keys: ['x', 'y'],
      min: -1, max: 1, step: 0.125,
      onInput: console.log, onChange: console.log
    })

    ui.position(context3, 'value', {
      label: 'Vector',
      keys: ['0', '1', '2'],
      min: -1, max: 1, step: 0.125,
      onInput: console.log, onChange: console.log
    })
  })

}
