import { mountUi } from 'tweak-ui'
export default () => {
  const object = {
    vector: { x: 0, y: 1, z: 0 },
    array: [3, 2, 1],
  }

  mountUi('.example-frame', (ui) => {
    ui.vector(object, 'vector', {
      label: 'Vector XYZ',
      min: -1,
      max: 1,
      step: 0.125,
      onInput: console.log,
      onChange: console.log,
    })

    ui.vector(object, 'vector', {
      label: 'Vector XY',
      keys: ['x', 'y'],
      min: -1,
      max: 1,
      step: 0.125,
      onInput: console.log,
      onChange: console.log,
    })

    ui.vector(object, 'array', {
      label: 'Array',
      keys: ['0', '1', '2'],
      min: -1,
      max: 1,
      step: 0.125,
      onInput: console.log,
      onChange: console.log,
    })

    ui.control('JSON', () => JSON.stringify(object, null, 2))
  })
}
