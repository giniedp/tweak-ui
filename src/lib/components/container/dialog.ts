import { Attributes, Children, FactoryComponent, default as m, Vnode } from 'mithril'
import { redrawUi } from '../../mount'

/**
 * Bar component model
 * @public
 */
export type DialogAttrs = Attributes & {
  /**
   * Custom CSS Style
   */
  style?: Partial<CSSStyleDeclaration>
}

export function uiDialog<T>(attrs: DialogAttrs, children?: Children): Vnode<DialogAttrs> {
  return m(DialogComponent, attrs, children)
}

export const DialogComponent: FactoryComponent<DialogAttrs> = () => {
  let dialogRef: HTMLDialogElement | null = null
  return {
    oncreate: ({ dom }) => {
      dialogRef = dom as HTMLDialogElement
      dialogRef.addEventListener('close', redrawUi)
    },
    onremove: () => {
      dialogRef?.removeEventListener('close', redrawUi)
      dialogRef = null
    },
    view: ({ attrs, children }) => {
      return m('dialog.twk-dialog', attrs, [dialogRef?.open ? children : null])
    },
  }
}
