import * as TweakUI from 'tweak-ui'

export default () => {

  const person = { name: "John Doe", age: 42, eyes: '#4F8' }
  TweakUI.mount(".example-frame", (ui) => {
    ui.accordion({ expand: 0 }, () => {
      ui.group("Group 1", () => {
        ui.text(person, 'name')
        ui.number(person, 'age')
      })
      ui.group("Group 2", () => {
        ui.color(person, 'eyes')
      })
    })
  })

}
