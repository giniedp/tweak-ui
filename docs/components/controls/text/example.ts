import { mountUi } from 'tweak-ui'

export default () => {
  const object = { message: 'Helloo World' }
  mountUi('.example-frame', (ui) => {
    ui.string(object, 'message', {
      label: 'Text',
      oninput: console.log,
    })
    ui.string(object, 'message', {
      label: 'Text',
      disabled: true,
    })
    ui.pre('JSON', () => JSON.stringify(object, null, 2))
  })
}
