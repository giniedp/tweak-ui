import { mountUi, uiImage } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.image({
      src: 'https://picsum.photos/id/893/400/300',
    })

    ui.image({
      src: 'https://picsum.photos/id/893/400/300',
      aspect: 16 / 9,
    })

    ui.image({
      src: 'https://picsum.photos/id/893/400/300',
      aspect: 16 / 9,
      width: 100,
    })

    ui.widget('Image', () =>
      uiImage({
        src: 'https://picsum.photos/id/893/400/300',
        aspect: 16 / 9,
        width: 100,
      }),
    )

    ui.widget('Custom Render', () =>
      uiImage({
        render: renderImage,
        aspect: 1,
        width: 128,
      }),
    )
  })
}

async function renderImage(): Promise<ImageBitmap> {
  const width = 128,
    height = 128
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')!

  // checkerboard
  const cell = 16
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      ctx.fillStyle = (x / cell + y / cell) % 2 === 0 ? '#555' : '#333'
      ctx.fillRect(x, y, cell, cell)
    }
  }

  // magenta tint so it's obviously a stub
  ctx.fillStyle = 'rgba(180, 0, 255, 0.15)'
  ctx.fillRect(0, 0, width, height)

  // label
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '11px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('rendered', width / 2, height / 2)

  return createImageBitmap(canvas)
}
