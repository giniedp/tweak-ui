import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Harness, harness } from '../../../testing'
import { uiScalarWidget } from './scalar'

describe('ScalarWidgetComponent', () => {
  let h: Harness
  beforeEach(() => (h = harness()))
  afterEach(() => h.unmount())

  it('uses the field name as the label when no label is given', () => {
    const model = { volume: 5 }
    h.mount({
      view: () => uiScalarWidget({ value: model, field: 'volume' }),
    })

    expect(h.find('.twk-widget-label').textContent).toBe('volume')
  })

  it('renders an explicit label instead of the field name', () => {
    const model = { volume: 5 }
    h.mount({
      view: () => uiScalarWidget({ value: model, field: 'volume', label: 'Volume' }),
    })

    expect(h.find('.twk-widget-label').textContent).toBe('Volume')
  })

  it('formats the displayed value using the decimals option while not focused', () => {
    const model = { volume: 5 }
    h.mount({
      view: () => uiScalarWidget({ value: model, field: 'volume', decimals: 2 }),
    })

    expect(h.find<HTMLInputElement>('input').value).toBe('5.00')
  })

  it('clamps the value to min/max and writes it back through oninput/onchange', () => {
    const model = { volume: 5 }
    const oninput = vi.fn()
    const onchange = vi.fn()

    h.mount({
      view: () =>
        uiScalarWidget({
          value: model,
          field: 'volume',
          min: 0,
          max: 10,
          oninput,
          onchange,
        }),
    })

    const input = h.find<HTMLInputElement>('input')
    expect(input.value).toBe('5.0')

    input.value = '15'
    h.fire(input, 'input')
    expect(model.volume).toBe(10)
    expect(oninput).toHaveBeenCalledTimes(1)
    expect(oninput.mock.calls[0][0]).toBe(model)
    expect(oninput.mock.calls[0][1]).toBe(10)
    expect(onchange).not.toHaveBeenCalled()

    input.value = '-5'
    h.fire(input, 'change')
    expect(model.volume).toBe(0)
    expect(onchange).toHaveBeenCalledTimes(1)
    expect(onchange.mock.calls[0][0]).toBe(model)
    expect(onchange.mock.calls[0][1]).toBe(0)
  })

  it('adjusts the value by one step per wheel tick while focused', () => {
    const model = { level: 5 }
    const onchange = vi.fn()

    h.mount({
      view: () => uiScalarWidget({ value: model, field: 'level', step: 1, onchange }),
    })

    const input = h.find<HTMLInputElement>('input')
    h.fire(input, 'focus')

    h.fire(input, 'wheel', { deltaY: -100 })
    expect(model.level).toBe(6)
    expect(onchange).toHaveBeenCalledTimes(1)
    expect(onchange.mock.calls[0][0]).toBe(model)
    expect(onchange.mock.calls[0][1]).toBe(6)

    h.fire(input, 'wheel', { deltaY: 100 })
    expect(model.level).toBe(5)
    expect(onchange).toHaveBeenCalledTimes(2)
    expect(onchange.mock.calls[1][1]).toBe(5)
  })

  it('ignores wheel input while not focused', () => {
    const model = { level: 5 }
    h.mount({
      view: () => uiScalarWidget({ value: model, field: 'level', step: 1 }),
    })

    h.fire(h.find('input'), 'wheel', { deltaY: -100 })
    expect(model.level).toBe(5)
  })
})
