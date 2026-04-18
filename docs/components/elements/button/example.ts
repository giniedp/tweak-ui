import { mountUi } from 'tweak-ui'

export default () => {
  let value = 0
  mountUi('.example-frame', (ui) => {
    ui.button('Button +1', { onClick: () => value++ })
    ui.button('Button -1', { onClick: () => value-- })
    ui.button('Button reset', { onClick: () => (value = 0) })
    ui.control('Value: ', () => value)
  })
}
