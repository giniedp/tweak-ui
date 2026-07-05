import { mountUi } from 'tweak-ui'
export default () => {
  const object = {
    value: 5,
  }

  mountUi('.example-frame', (ui) => {
    ui.poll({
      label: 'Poll',
      value: object,
      binding: {
        get: () => {
          object.value += 1
          return object.value
        },
      },
    })
    ui.string({
      readonly: true,
      rows: 5,
      get value() {
        return JSON.stringify(object, null, 2)
      },
    })
  })
}
