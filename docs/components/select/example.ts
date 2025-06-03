import * as TweakUi from 'tweak-ui'

export default () => {

  TweakUi.mount(".example-frame", [{
      type: "select",
      label: "Array",
      value: "foo",
      options: ["foo", "bar", "baz", { label: "a label", value: {} }],
      onInput: console.log
    }, {
      type: "select",
      label: "Key Value",
      value: "foo",
      options: { Foo: "foo", Bar: "bar", Baz: "baz", "A Label": {} },
      onInput: console.log
    }])

}
