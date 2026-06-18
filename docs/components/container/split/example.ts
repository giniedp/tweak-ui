import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.split(
      {
        style: {
          height: '50vh',
        },
      },
      () => {
        ui.group('Group 1', () => {
          ui.string({ value: 'Ver' })
          ui.string({ value: 'ti' })
          ui.string({ value: 'cal' })
        })

        ui.group('Group 2', () => {
          ui.string({ value: 'Ver' })
          ui.string({ value: 'ti' })
          ui.string({ value: 'cal' })
        })

        ui.split(
          {
            flow: 'row',
          },
          () => {
            ui.group('Group 1', () => {
              ui.string({ value: 'Ver' })
              ui.string({ value: 'ti' })
              ui.string({ value: 'cal' })
            })

            ui.group('Group 2', () => {
              ui.string({ value: 'Ver' })
              ui.string({ value: 'ti' })
              ui.string({ value: 'cal' })
            })
          },
        )
      },
    )
  })
}
