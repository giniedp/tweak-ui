import m, { FactoryComponent } from 'mithril'
import { cssClass, twuiClass } from '../../core/utils'
import { GroupComponent } from './group'

export interface RootAttrs {
  //
}

export const Twui: FactoryComponent<RootAttrs> = () => {
  return {
    view: (node) => {
      return m(
        'div',
        {
          class: cssClass([twuiClass('root'), twuiClass('group')]),
        },
        node.children,
      )
    },
  }
}
