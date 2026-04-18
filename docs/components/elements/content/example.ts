import { h, mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    let counter = 0
    ui.control(
      'Static Text',
      `
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
      sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
      counter value is ${counter}
    `,
    )
    ui.control(
      'Static HTML',
      h.trust(`
        <b onclick="alert('Dont trust HTML blindly')" style="color: red; cursor: pointer">
          Don't click me
        </b>
        counter value is ${counter}
      `),
    )
    ui.control(
      'Static Mithril',
      h(
        'a',
        {
          target: '_blank',
          href: 'https://mithril.js.org/',
        },
        'this is a mithril link',
        `  counter value is ${counter}`,
      ),
    )
    ui.control('Dynamic content', () => {
      return ` (counter: ${counter})`
    })
    ui.button('Update', {
      onClick: () => {
        console.log(counter++)
        h.redraw()
      },
    })
  })
}
