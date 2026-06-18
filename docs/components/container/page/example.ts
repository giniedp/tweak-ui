import { h, mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (b) => {
    b.page({ style: { height: '500px' } }, () => {
      b.pageFooter({}, () => {
        b.view(() => {
          return 'Footer'
        })
      })

      b.pageHeader(() => {
        b.bar(
          {
            start: 'Hello World',
          },
          () => {
            b.barEnd(() => {
              b.button('Click Me')
            })
          },
        )
      })

      b.split({ flow: 'row' }, () => {
        b.group({ title: 'Group' }, () => {
          b.boolean({ label: 'Checkbox', value: true })
        })

        b.splitContent({ fluid: true }) // empty content area
      })
    })
  })
}
