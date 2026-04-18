import m, { Children, FactoryComponent, Vnode } from 'mithril'

import { cssClass, isNumber, isString, twuiClass } from '../../core/utils'

/**
 * Image component model
 * @public
 */
export interface ImageAttrs {
  /**
   * A label for the control, only rendered if the control is used in a context that supports it (e.g. group).
   */
  label?: string

  /**
   * The image source url
   */
  src?: string | string[]
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
  onClick?: (ctrl: ImageAttrs) => void
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
    view: ({ attrs: { src, aspect, fit, width, onClick } }) => {
      return (Array.isArray(src) ? src : [src]).map((src) => {
        console.log(src)
        return m(
          'picture',
          {
            class: cssClass({
              [twuiClass('image')]: true,
              [twuiClass('image', 'aspect')]: !!aspect,
            }),
            style: {
              '--twui-aspect': ratio(aspect),
              '--twui-fit': fit || 'fit',
              width: size(width),
            },
          },
          m('img', {
            src: src,
            onclick: onClick,
          }),
        )
      })
    },
  }
}
