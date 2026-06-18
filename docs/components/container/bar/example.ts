import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (b) => {
    let count = 0
    b.bar(() => {
      b.view(() => `Count: ${count}`)

      b.barEnd(() => {
        b.button('D', { square: true, onclick: () => count-- })
        b.button('E', { square: true, onclick: () => count-- })
        b.button('F', { square: true, onclick: () => count-- })
      })

      b.barStart(() => {
        b.button('A', { square: true, onclick: () => count++ })
        b.button('B', { square: true, onclick: () => count++ })
        b.button('C', { square: true, onclick: () => count++ })
      })
    })
  })
}
