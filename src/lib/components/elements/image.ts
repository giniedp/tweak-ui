import m, { Children, FactoryComponent, Vnode } from 'mithril'

import { EventAttrs, StyleAttr } from '../../core'
import { isNumber } from '../../core/utils'

/**
 * Image component model
 * @public
 */
export type ImageAttrs = EventAttrs & {
  /**
   * The image source url
   */
  src?: string | any

  /**
   *
   */
  render?: (src: any) => Promise<ImageBitmap>

  /**
   * Aspect ratio of the picture container
   */
  aspect?: number | string

  /**
   * A fixed width
   */
  width?: number | string

  /**
   *
   */
  fit?: 'contain' | 'cover' | 'fill'

  class?: string
  style?: StyleAttr
}

export function uiImage(attrs: ImageAttrs, children?: Children): Vnode<ImageAttrs> {
  return m(ImageComponent, attrs, children)
}

export const ImageComponent: FactoryComponent<ImageAttrs> = () => {
  let src: string
  let srcLoadArg: any
  let srcRender: (src: any) => Promise<ImageBitmap>

  let cssWidth: string
  let cssAspect: string
  let cssFit: string

  let elImage: HTMLImageElement
  let loadGeneration = 0
  let lastSrcLoadArg: any
  let lastSrc: string

  function hasChanged() {
    return srcLoadArg !== lastSrcLoadArg || src !== lastSrc
  }

  function parseSize(width: ImageAttrs['width']) {
    if (isNumber(width)) {
      return `${width}px`
    }
    return width
  }

  function parseAspect(aspect: ImageAttrs['aspect']) {
    return String(aspect || '')
  }

  function captureState(attrs: ImageAttrs) {
    src = typeof attrs.src === 'string' ? attrs.src : ''
    srcLoadArg = attrs.src
    srcRender = attrs.render!
    cssAspect = parseAspect(attrs.aspect)
    cssWidth = parseSize(attrs.width)!
    cssFit = attrs.fit || 'fit'
  }

  async function loadImage() {
    if (!elImage || !hasChanged()) {
      return
    }
    lastSrcLoadArg = srcLoadArg
    lastSrc = src
    if (!srcRender) {
      elImage.src = src
      return
    }
    loadGeneration++
    const generation = loadGeneration

    elImage.classList.add('twk-loading')
    const bitmap = await srcRender(srcLoadArg)
    if (generation !== loadGeneration) {
      bitmap.close() // stale, discard
      return
    }

    await renderThumbnail(elImage, bitmap)
    elImage.classList.remove('twk-loading')
  }

  async function renderThumbnail(img: HTMLImageElement, bitmap: ImageBitmap) {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0)
    const blob = await canvas.convertToBlob({ type: 'image/png' })
    bitmap.close()

    const next = URL.createObjectURL(blob)
    URL.revokeObjectURL(img.src)
    img.src = next
  }

  function grabRestAttrs(attrs: ImageAttrs) {
    const { src, render, aspect, width, fit, ...rest } = attrs
    return rest
  }

  return {
    oninit({ attrs }) {
      captureState(attrs)
    },
    onbeforeupdate({ attrs }, old) {
      captureState(attrs)
    },
    onupdate() {
      loadImage()
    },
    view: ({ attrs }) => {
      return m('img.twk-image', {
        src,
        style: {
          width: cssWidth,
          aspectRatio: cssAspect,
          objectFit: cssFit,
          ...(attrs.style || {}),
        },

        onremove: () => {
          elImage = null!
        },
        oncreate: ({ dom }) => {
          elImage = dom as HTMLImageElement
          loadImage()
        },
        ...grabRestAttrs(attrs),
      })
    },
  }
}
