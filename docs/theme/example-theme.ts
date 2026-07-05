import { mountUi, redrawUi, ControlAdapter } from 'tweak-ui'
const remAdapter: ControlAdapter<string, number> = {
  toControl: (value) => {
    return parseFloat(value.replace('rem', ''))
  },
  fromControl: (value) => {
    return `${value}rem`
  },
}

export default (element: HTMLElement) => {
  const defaultTheme = {
    '--twk-color-base-100': '#2a303c',
    '--twk-color-base-200': '#242933',
    '--twk-color-base-300': '#20252e',
    '--twk-color-base-content': '#b2ccd6',
    '--twk-color-neutral': '#1c212b',
    '--twk-color-neutral-content': '#b2ccd6',
    '--twk-color-accent': '#f9aa33',
  }

  const darkTheme = {
    '--twk-color-base-100': '#1d232a',
    '--twk-color-base-200': '#191e24',
    '--twk-color-base-300': '#15191e',
    '--twk-color-base-content': '#ecf9ff',
    '--twk-color-neutral': '#09090b',
    '--twk-color-neutral-content': '#e4e4e7',
    '--twk-color-accent': '#f9aa33',
  }

  const lightTheme = {
    '--twk-color-base-100': '#ffffff',
    '--twk-color-base-200': '#f5f5f5',
    '--twk-color-base-300': '#ebebeb',
    '--twk-color-base-content': '#000000',
    '--twk-color-neutral': '#000000',
    '--twk-color-neutral-content': '#ffffff',
    '--twk-color-accent': '#2196f3',
  }

  const colorKeys = Object.keys(darkTheme)

  const variables = {
    '--twk-size': '1.375rem',
    '--twk-gap': '0.125rem',
    '--twk-inset': '0.125rem',
    '--twk-radius': '0.25rem',

    '--twk-label-size': '7rem',
    '--twk-label-pad-x': '0.25rem',
    '--twk-label-pad-y': '0rem',
    '--twk-input-height': 'var(--twk-size)',
    '--twk-input-pad-x': '0.375rem',
    '--twk-input-pad-y': '0rem',
    '--twk-button-height': 'var(--twk-size)',
    '--twk-button-pad-x': '0.5rem',
    '--twk-button-pad-y': '0.25rem',
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
      ui.scalar(variables, '--twk-size', {
        label: 'Size',
        min: 1,
        step: 1 / 16,
        max: 2,
        adapter: remAdapter,
        range: true,
        oninput: update,
        decimals: 3,
        // description:
        //   'The size of the main UI elements, used for example as height for inputs and buttons.',
      })
      ui.scalar(variables, '--twk-inset', {
        label: 'Inset',
        min: 0,
        step: 1 / 16,
        max: 1,
        adapter: remAdapter,
        range: true,
        oninput: update,
        decimals: 3,
        // description: 'The inset within the root element, applied as padding',
      })
      ui.scalar(variables, '--twk-gap', {
        label: 'Gap',
        min: 0,
        step: 1 / 16,
        max: 1,
        adapter: remAdapter,
        range: true,
        oninput: update,
        decimals: 3,
        // description: 'The flexbox and grid gap between elements',
      })
      ui.scalar(variables, '--twk-radius', {
        label: 'Radius',
        min: 0,
        step: 1 / 16,
        max: 1,
        adapter: remAdapter,
        range: true,
        oninput: update,
        decimals: 3,
        // description: 'The border-radius for elements that have rounded corners',
      })
    })

    ui.group('Colors', { collapsible: true }, () => {
      ui.flex({ flow: 'row' }, () => {
        ui.button('Default', {
          flex: '1',
          onclick: () => {
            Object.assign(variables, defaultTheme)
            update()
          },
        })
        ui.button('Dark', {
          flex: '1',
          onclick: () => {
            Object.assign(variables, darkTheme)
            update()
          },
        })
        ui.button('Light', {
          flex: '1',
          onclick: () => {
            Object.assign(variables, lightTheme)
            update()
          },
        })
      })

      for (const key of colorKeys) {
        ui.color(variables, key as any, {
          label: key.replace('--twk-color-', '').replace(/-/g, ' '),
          format: '#rgb',
          onchange: update,
        })
      }
    })
    ui.group('CSS', () => {
      ui.pre(null!, () =>
        JSON.stringify(variables, null, 2).replace(/"/g, '').replace(/,/g, ';').trim(),
      )
    })
  })
}
