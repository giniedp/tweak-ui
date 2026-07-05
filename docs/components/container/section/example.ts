import { h, mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (b) => {
    b.section({ style: { height: '500px' } }, () => {
      b.sectionFooter({}, () => {
        b.view(() => 'Footer')
      })

      b.sectionHeader(() => {
        b.view(() => 'Header')
      })

      b.view(() => 'Content')
    })
  })
}
