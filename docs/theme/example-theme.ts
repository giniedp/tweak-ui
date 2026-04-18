import { ControlValueAdapter, mountUi, redrawUi } from 'tweak-ui'

const remAdapter: ControlValueAdapter<string, number> = {
  toControl: (value) => {
    console.log(value, value.replace('rem', ''))
    return parseFloat(value.replace('rem', ''))
  },
  fromControl: (value) => {
    return `${value}rem`
  },
}

export default (element: HTMLElement) => {
  const defaultTheme = {
    '--twui-color-base-100': '#2a303c',
    '--twui-color-base-200': '#242933',
    '--twui-color-base-300': '#20252e',
    '--twui-color-base-content': '#b2ccd6',
    '--twui-color-neutral': '#1c212b',
    '--twui-color-neutral-content': '#b2ccd6',
    '--twui-color-accent': '#f9aa33',
  }

  const darkTheme = {
    '--twui-color-base-100': '#1d232a',
    '--twui-color-base-200': '#191e24',
    '--twui-color-base-300': '#15191e',
    '--twui-color-base-content': '#ecf9ff',
    '--twui-color-neutral': '#09090b',
    '--twui-color-neutral-content': '#e4e4e7',
    '--twui-color-accent': '#f9aa33',
  }

  const lightTheme = {
    '--twui-color-base-100': '#ffffff',
    '--twui-color-base-200': '#f5f5f5',
    '--twui-color-base-300': '#ebebeb',
    '--twui-color-base-content': '#000000',
    '--twui-color-neutral': '#000000',
    '--twui-color-neutral-content': '#ffffff',
    '--twui-color-accent': '#2196f3',
  }

  const colorKeys = Object.keys(darkTheme)

  const variables = {
    '--twui-size': '1.375rem',
    '--twui-gap': '0.125rem',
    '--twui-inset': '0.125rem',
    '--twui-radius': '0.25rem',

    '--twui-label-size': '7rem',
    '--twui-label-pad-x': '0.25rem',
    '--twui-label-pad-y': '0rem',
    '--twui-input-height': 'var(--twui-size)',
    '--twui-input-pad-x': '0.375rem',
    '--twui-input-pad-y': '0rem',
    '--twui-button-height': 'var(--twui-size)',
    '--twui-button-pad-x': '0.5rem',
    '--twui-button-pad-y': '0.25rem',
    ...defaultTheme,
  }

  function update() {
    for (const key in variables) {
      element.style.setProperty(key, variables[key as keyof typeof variables])
    }
    redrawUi()
  }
  mountUi(element, (ui) => {
    ui.group('Sizes', { collapsible: true }, () => {
      ui.number(variables, '--twui-size', {
        label: 'Size',
        min: 1,
        step: 0.125,
        max: 2,
        adapter: remAdapter,
        slider: true,
        onInput: update,
        description:
          'The size of the main UI elements, used for example as height for inputs and buttons.',
      })
      ui.number(variables, '--twui-inset', {
        label: 'Inset',
        min: 0,
        step: 0.125,
        max: 1,
        adapter: remAdapter,
        slider: true,
        onInput: update,
        description: 'The inset within the root element, applied as padding',
      })
      ui.number(variables, '--twui-gap', {
        label: 'Gap',
        min: 0,
        step: 0.125,
        max: 1,
        adapter: remAdapter,
        slider: true,
        onInput: update,
        description: 'The flexbox and grid gap between elements',
      })
      ui.number(variables, '--twui-radius', {
        label: 'Radius',
        min: 0,
        step: 0.125,
        max: 1,
        adapter: remAdapter,
        slider: true,
        onInput: update,
        description: 'The border-radius for elements that have rounded corners',
      })
    })

    ui.group('Colors', { collapsible: true }, () => {
      ui.list({ horizontal: true }, () => {
        ui.button('Default', {
          onClick: () => {
            Object.assign(variables, defaultTheme)
            update()
          },
        })
        ui.button('Dark', {
          onClick: () => {
            Object.assign(variables, darkTheme)
            update()
          },
        })
        ui.button('Light', {
          onClick: () => {
            Object.assign(variables, lightTheme)
            update()
          },
        })
      })

      for (const key of colorKeys) {
        ui.color(variables, key as any, {
          label: key.replace('--twui-color-', '').replace(/-/g, ' '),
          format: '#rgb',
          onChange: update,
        })
      }
    })
    ui.group('CSS', () => {
      ui.pre(() => JSON.stringify(variables, null, 2).replace(/"/g, '').replace(/,/g, ';').trim())
    })
  })
}
