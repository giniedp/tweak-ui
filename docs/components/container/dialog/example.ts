import {
  h,
  mountUi,
  uiBar,
  uiBarContent,
  uiBarEnd,
  uiBarStart,
  uiButton,
  uiDialog,
  uiDivider,
  uiFlex,
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
          },
          uiSection(
            {
              class: 'twk-dialog-content twk-bg-300',
              header: uiBar(
                {
                  class: 'twk-bg-neutral twk-p-2',
                },
                [
                  uiBarEnd(
                    {},
                    uiButton({ large: true, square: true, onclick: () => dialogRef?.close() }, '×'),
                  ),
                  h('div.twk-px-2', {}, 'https://picsum.photos/400/200'),
                ],
              ),
              footer: uiBar({}, [
                uiBarEnd({ class: 'twk-p-1 twk-flex-row twk-gap-1' }, [
                  uiButton({ large: true, onclick: () => dialogRef?.close() }, 'Cancel'),
                  uiButton({ large: true, onclick: () => dialogRef?.close() }, 'OK'),
                ]),
              ]),
            },
            [
              h('div.twk-p-4.twk-gap-4.twk-flex', { style: { minHeight: '10rem' } }, [
                uiImage({
                  class: 'twk-bg-checker',
                  aspect: 1,
                  fit: 'contain',
                  width: '100%',
                  src: 'https://picsum.photos/400/200',
                }),
                uiBar({}, [
                  uiBarStart({}, h('span.twk-color-dim', {}, 'MIP')),
                  uiBarContent({ class: 'twk-flex-row' }, [
                    uiButton({ square: true }, '0'),
                    uiButton({ square: true }, '1'),
                    uiButton({ square: true }, '2'),
                    uiButton({ square: true }, '3'),
                  ]),
                  uiBarEnd({}, h('span.twk-color-dim', {}, '400x200')),
                ]),
                uiFlex({ flow: 'row', class: 'twk-gap-4' }, [
                  h('div', [h('div.twk-color-dim', {}, 'SIZE'), h('div', {}, '400x200')]),
                  h('div.twk-divider-v'),
                  h('div', [h('div.twk-color-dim', {}, 'FORMAT'), h('div', {}, 'rgba')]),
                  h('div.twk-divider-v'),
                  h('div', [h('div.twk-color-dim', {}, 'MIP LEVELS'), h('div', {}, '1')]),
                ]),
              ]),
            ],
          ),
        ),
      ]
    },
  })
}
