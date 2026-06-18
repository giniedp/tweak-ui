import { mountUi, TreeDataAdapter } from 'tweak-ui'

// Example node type
type MyNode = { id: string; label: string; icon?: string; children?: MyNode[] }

const adapter: TreeDataAdapter<MyNode> = {
  getId: (node) => node.id,
  getLabel: (node) => node.label,
  getIcon: (node) => node.icon,
  getChildren: (node) => node.children,
  isExpandable: (node) => !!node.children && node.children.length > 0,
}

const data: MyNode[] = [
  {
    id: '1',
    label: 'Root',
    icon: '📁',
    children: Array.from({ length: 100 }, (_, i) => {
      return {
        id: `${i + 1000}`,
        label: 'Child ' + (i + 1),
        icon: '📁',
        children: Array.from({ length: 10 }, (_, j) => ({
          id: `${i + 1000}-${j + 1}`,
          label: `Grandchild ${j + 1}`,
          icon: '📄',
        })),
      }
    }),
  },
]

export default () => {
  mountUi('.example-frame', (ui) => {
    let selectedId: string = null!
    ui.tree({
      adapter,
      data,
      style: {
        height: '400px',
      },
      get selectedId() {
        return selectedId
      },
      onSelect: (node) => {
        selectedId = adapter.getId(node)
        console.log('Selected node:', node, 'Selected ID:', selectedId)
      },
    })
  })
}
