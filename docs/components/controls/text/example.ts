import { mountUi } from 'tweak-ui'

export default () => {
  const object = { message: 'Helloo World' }
  mountUi('.example-frame', (ui) => {
    ui.text(object, 'message', {
      label: 'Text',
      onInput: console.log,
    })
    ui.control('JSON', () => JSON.stringify(object, null, 2))
  })
}
