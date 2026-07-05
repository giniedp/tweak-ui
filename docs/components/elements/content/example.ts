import { h, mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    let counter = 0

    ui.group(() => {
      ui.widget('Static Text', 'This is a static text content, wrapped in a control with a label.')

      ui.widget(
        'Static HTML',
        h.trust(`
          <div>
          This is a static HTML content, wrapped in a control with a label.
          <br>
          <br>
          The counter value is <b style="color: green;">'${counter}'</b> and it won't update when the counter changes.
          <br>
          <br>
          <b onclick="alert('Dont trust HTML blindly')" style="color: red; cursor: pointer">
            Beware of trusting HTML blindly!
          </b>
          </div>
        `),
      )

      ui.widget(
        'Static Mithril',
        h('div', {}, [
          'This is a static Mithril content, wrapped in a control with a label. ',
          h(
            'a',
            {
              target: '_blank',
              href: 'https://mithril.js.org/',
            },
            'this is a mithril link',
          ),
          ' The counter value is ',
          counter,
          " and it won't update when the counter changes.",
        ]),
      )

      ui.widget('Dynamic content', () => {
        return ` (counter: ${counter})`
      })

      ui.divider()
      ui.button('Update', {
        onclick: () => {
          console.log(counter++)
          h.redraw()
        },
      })
    })
  })
}
