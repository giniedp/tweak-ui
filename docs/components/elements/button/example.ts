import { mountUi } from 'tweak-ui'

export default () => {
  let value = 0
  mountUi('.example-frame', (ui) => {
    ui.flex({ flow: 'row' }, () => {
      ui.button('-', { square: true, onclick: () => value-- })
      ui.button('Reset', { flex: '1', onclick: () => (value = 0) })
      ui.button('+', { square: true, onclick: () => value++ })
    })
    ui.flex({ flow: 'row' }, () => {
      ui.button('-', { onclick: () => value-- })
      ui.button('Reset', { accent: true, onclick: () => (value = 0) })
      ui.button('+', { onclick: () => value++ })
      ui.button('Flexed', { flex: '1' })
    })
    ui.flex({ flow: 'row' }, () => {
      ui.button('large', { large: true })
      ui.button('large', { large: true, flex: '1' })
      ui.button('large', { large: true })
    })
  })
}
