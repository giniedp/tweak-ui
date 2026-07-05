import m, { Children, FactoryComponent, Vnode } from 'mithril'

import { getControlValue, setControlValue } from '../../core'
import { isNumber, isString } from '../../core/utils'
import { uiWidget, ValueWidgetAttrs } from '../elements'

/**
 * @public
 */
export type SelectOption = {
  label: string
  value: unknown
  disabled?: boolean
}
/**
 * @public
 */
export type SelectOptionArray = Array<SelectOption | SelectOptionGroup | string | number>
/**
 * @public
 */
export type SelectOptionsObject = {
  [key: string]: unknown
}
/**
 * @public
 */
export type SelectOptionGroup<T = SelectOptionArray | SelectOptionsObject> = {
  label: string
  options: T
  disabled?: boolean
}

/**
 * Select component select options
 * @public
 */
export type SelectModelOptions = SelectOptionArray | SelectOptionsObject

/**
 * Select component model
 * @public
 */
export type SelectAttrs<T = unknown, V = any> = ValueWidgetAttrs<T, V> & {
  /**
   * The select options
   */
  options?: SelectModelOptions

  /**
   * This is called once the control value is committed by the user.
   */
  onchange?: (model: T, value: V) => void

  /**
   * Disables the control input
   */
  readonly?: boolean
}

function optionsFromFlatArray(arr: SelectOptionArray): SelectOption[] {
  const res: SelectOption[] = []
  for (const it of arr) {
    if (isString(it) || isNumber(it)) {
      res.push({ value: it, label: String(it) })
      continue
    }
    if ('value' in it) {
      res.push(it)
      continue
    }
  }
  return res
}

function optionsFromArray(
  arr: SelectOptionArray,
): Array<SelectOption | SelectOptionGroup<SelectOption[]>> {
  const res: Array<SelectOption | SelectOptionGroup<SelectOption[]>> = []
  for (const it of arr) {
    if (isString(it) || isNumber(it) || it == null) {
      res.push({ value: it, label: String(it) })
    } else if ('value' in it) {
      res.push(it)
    } else if ('options' in it) {
      res.push({
        label: it.label,
        disabled: it.disabled,
        options: Array.isArray(it.options)
          ? optionsFromFlatArray(it.options)
          : optionsFromObject(it.options),
      })
    }
  }
  return res
}

function optionsFromObject(obj: SelectOptionsObject): Array<SelectOption> {
  return Object.keys(obj)
    .sort()
    .map((key) => ({ value: obj[key], label: key }))
}

function getOptions(
  node: m.Vnode<SelectAttrs>,
): Array<SelectOption | SelectOptionGroup<SelectOption[]>> {
  const options = node.attrs.options

  if (!options) {
    return []
  }

  if (Array.isArray(options)) {
    return optionsFromArray(options)
  }
  return optionsFromObject(options)
}

export function uiSelect<T>(attrs: SelectAttrs<T>, children?: Children): Vnode<SelectAttrs<T>> {
  return m(SelectComponent as any, attrs as any, children)
}

export const SelectComponent: FactoryComponent<SelectAttrs> = () => {
  let attrs: SelectAttrs
  let options: Array<SelectOption | SelectOptionGroup<SelectOption[]>>

  function getSelectedIndex() {
    const value = getControlValue(attrs)
    let i = 0
    for (const o0 of options) {
      if ('options' in o0) {
        for (const o1 of o0.options) {
          if (o1.value === value) {
            return i
          }
          i++
        }
      } else {
        if (o0.value === value) {
          return i
        }
        i++
      }
    }
  }

  function getSelectionAt(index: number) {
    let i = 0
    for (const o0 of options) {
      if ('options' in o0) {
        for (const o1 of o0.options) {
          if (i === index) {
            return o1.value
          }
          i += 1
        }
      } else {
        if (i === index) {
          return o0.value
        }
        i += 1
      }
    }
    return null
  }

  function onchange(e: Event) {
    const el = e.target as HTMLSelectElement
    const value = getSelectionAt(el.selectedIndex)
    const written = setControlValue(attrs, value)
    attrs.onchange?.(attrs, written)
  }

  return {
    view: (node) => {
      attrs = node.attrs
      options = getOptions(node)
      return uiWidget(
        {
          tagName: 'label.twk-select',
          label: attrs.label ?? attrs.field,
          class: attrs.class,
        },
        m(
          'select.twk-select-input',
          {
            selectedIndex: getSelectedIndex(),
            onchange: onchange,
            disabled: attrs.readonly,
          },
          options.map((it) => {
            if ('options' in it) {
              return m(
                'optgroup',
                {
                  disabled: !!it.disabled,
                  label: it.label || '',
                },
                it.options.map(option),
              )
            }
            return option(it)
          }),
        ),
      )
    },
  }
}

function option(it: SelectOption) {
  return m(
    'option',
    {
      value: it.value,
      label: it.label,
      disabled: !!it.disabled,
    },
    it.label || '',
  )
}
