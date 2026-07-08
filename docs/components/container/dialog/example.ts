import {
  h,
  mountUi,
  uiBar,
  uiBarContent,
  uiBarEnd,
  uiBarStart,
  uiButton,
  uiDialog,
  uiImage,
  uiSection,
} from 'tweak-ui'

export default () => {
  let dialogRef: HTMLDialogElement | null = null

  mountUi('.example-frame', {
    view: () => {
      return [
        uiButton({ onclick: () => dialogRef?.showModal() }, 'Open'),
        uiDialog(
          {
            oncreate: ({ dom }) => (dialogRef = dom as HTMLDialogElement),
            onremove: () => (dialogRef = null),
            // click on the backdrop (the <dialog> element itself, not its content) closes it
            onclick: (e: MouseEvent) => {
              if (e.target === dialogRef) {
                dialogRef?.close()
              }
            },
          },
          uiSection(
            {
              class: 'twk-dialog-content twk-bg-300',
              header: uiBar({ class: 'twk-bg-neutral twk-p-2' }, [
                h('div.twk-px-2', {}, 'Image Preview'),
                uiBarEnd(
                  {},
                  uiButton(
                    {
                      large: true,
                      square: true,
                      title: 'Close',
                      onclick: () => dialogRef?.close(),
                    },
                    '×',
                  ),
                ),
              ]),
              footer: uiBar({}, [
                uiBarEnd({ class: 'twk-p-1 twk-flex-row twk-gap-1' }, [
                  uiButton({ large: true, onclick: () => dialogRef?.close() }, 'Cancel'),
                  uiButton({ large: true, accent: true, onclick: () => dialogRef?.close() }, 'OK'),
                ]),
              ]),
            },
            [h(dialogContent)],
          ),
        ),
      ]
    },
  })
}

function dialogContent() {
  let mip = 0

  const path = 'textures/character_diffuse.png'
  const mipSizes = ['400x200', '200x100', '100x50', '50x25']
  const mipMemory = ['512 KB', '128 KB', '32 KB', '8 KB']
  const [w, h1] = mipSizes[mip].split('x')

  function fields() {
    return [
      ['Path', path],
      ['Size', mipSizes[mip]],
      ['Format', 'BC7 (RGBA8)'],
      ['Color Space', 'sRGB'],
      ['Mip Level', `${mip} / ${mipSizes.length - 1}`],
      ['Memory', mipMemory[mip]],
      ['Wrap Mode', 'Repeat'],
      ['Filter', 'Bilinear'],
    ]
  }

  return {
    view() {
      return h(
        'div.twk-p-4.twk-gap-4.twk-flex',
        { style: { minHeight: '10rem', overflow: 'auto' } },
        [
          uiImage({
            class: 'twk-bg-checker',
            aspect: 1,
            fit: 'contain',
            width: '100%',
            src: `https://picsum.photos/id/1025/${w}/${h1}`,
          }),
          uiBar({}, [
            uiBarStart({}, h('span.twk-color-dim', {}, 'MIP')),
            uiBarContent(
              { class: 'twk-flex-row' },
              mipSizes.map((_, i) =>
                uiButton({ square: true, accent: mip === i, onclick: () => (mip = i) }, String(i)),
              ),
            ),
            uiBarEnd({}, h('span.twk-color-dim', {}, mipSizes[mip])),
          ]),
          h(
            'div.twk-grid',
            { style: { gridTemplateColumns: '1fr 1fr' }, class: 'twk-gap-2' },
            fields().map(([label, value], i) =>
              h(
                'div',
                {
                  style: {
                    gridColumn: i === 0 ? '1 / -1' : undefined,
                    overflow: 'hidden',
                  },
                },
                [
                  h('div.twk-color-dim.twk-text-xs', {}, label),
                  h(
                    'div.twk-text-sm',
                    {
                      style: {
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      },
                    },
                    value,
                  ),
                ],
              ),
            ),
          ),
        ],
      )
    },
  }
}
