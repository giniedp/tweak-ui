import { mountUi } from 'tweak-ui'

export default (element: HTMLElement) => {

  mountUi(element, [
    { type: "text",                   value: "i dont have a label" },
    { type: "text", label: "My text", value: "i do have a label" },
    { type: "text", label: "",        value: "i have an empty label" }
  ])

}
