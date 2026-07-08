import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Harness, harness } from '../../../testing'
import { uiInputWidget } from './input'

describe('InputWidgetComponent', () => {
  let h: Harness
  beforeEach(() => (h = harness()))
  afterEach(() => h.unmount())

  it('uses the field name as the label when no label is given', () => {
    const model = { name: 'foo' }
    h.mount({
      view: () => uiInputWidget({ value: model, field: 'name' }),
    })

    expect(h.find('.twk-widget-label').textContent).toBe('name')
  })

  it('renders an explicit label instead of the field name', () => {
    const model = { name: 'foo' }
    h.mount({
      view: () => uiInputWidget({ value: model, field: 'name', label: 'Name' }),
    })

    expect(h.find('.twk-widget-label').textContent).toBe('Name')
  })

  it('shows the bound value and writes it back through oninput/onchange', () => {
    const model = { name: 'foo' }
    const oninput = vi.fn()
    const onchange = vi.fn()

    h.mount({
      view: () =>
        uiInputWidget({
          value: model,
          field: 'name',
          oninput,
          onchange,
        }),
    })

    const input = h.find<HTMLInputElement>('input')
    expect(input.value).toBe('foo')

    input.value = 'bar'
    h.fire(input, 'input')
    expect(model.name).toBe('bar')
    expect(h.find<HTMLInputElement>('input').value).toBe('bar')
    expect(oninput).toHaveBeenCalledTimes(1)
    expect(oninput.mock.calls[0][0]).toBe(model)
    expect(oninput.mock.calls[0][1]).toBe('bar')
    expect(onchange).not.toHaveBeenCalled()

    input.value = 'baz'
    h.fire(input, 'change')
    expect(model.name).toBe('baz')
    expect(onchange).toHaveBeenCalledTimes(1)
    expect(onchange.mock.calls[0][0]).toBe(model)
    expect(onchange.mock.calls[0][1]).toBe('baz')
  })
})
