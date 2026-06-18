import m, { Children, FactoryComponent, Vnode } from 'mithril'

import { uiClass, isNumber, isString } from '../../core/utils'

/**
 * Image component model
 * @public
 */
export interface ImageAttrs {
  /**
   * The image source url
   */
  src?: string
  /**
   * Aspect ratio of the picture container
   */
  aspect?: string
  /**
   * A fixed width
   */
  width?: number | string
  /**
   *
   */
  fit?: 'contain' | 'cover' | 'fill'
  /**
   * This is callend when the control is clicked
   */
  onclick?: (ctrl: ImageAttrs) => void
}

export function uiImage(attrs: ImageAttrs, children?: Children): Vnode<ImageAttrs> {
  return m(ImageComponent, attrs, children)
}

export const ImageComponent: FactoryComponent<ImageAttrs> = () => {
  function ratio(spec: string | null | undefined) {
    if (!spec) {
      return null
    }
    const [x, y] = (spec || '1x1').split('x').map(Number)
    const padding = (y / x || 1) * 100
    return `${padding}%`
  }
  function size(width: ImageAttrs['width']) {
    if (isNumber(width)) {
      return `${width}px`
    }
    if (isString(width)) {
      return width
    }
  }
  return {
    view: ({ attrs: { src, aspect, fit, width, onclick } }) => {
      return m(
        'picture.twui-image',
        {
          class: uiClass({
            ['twui-image-aspect']: !!aspect,
          }),
          style: {
            '--twui-aspect': ratio(aspect),
            '--twui-fit': fit || 'fit',
            width: size(width),
          },
        },
        m('img', {
          src,
          onclick,
        }),
      )
    },
  }
}
