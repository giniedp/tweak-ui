import { mountUi, TreeDataAdapter } from 'tweak-ui'

// Example node type
type MyNode = { id: string; label: string; icon?: string; children?: MyNode[] }

const expandedMap = new Map<string, boolean>()
const adapter: TreeDataAdapter<MyNode> = {
  version: 1,
  nodeId: (node) => node.id,
  nodeLabel: (node) => node.label,
  nodeIcon: (node, open) => (!node.children ? '📄' : open ? '📂' : '📁'),
  nodeChildren: (node) => node.children,
  isExpanded: (node) => expandedMap.get(node.id) ?? false,
  setExpanded: (node, expanded) => {
    adapter.version++
    expandedMap.set(node.id, expanded)
  },
}
const data: MyNode[] = [
  {
    id: '1',
    label: 'Root',
    children: Array.from({ length: 100 }, (_, i) => {
      return {
        id: `${i + 1000}`,
        label: 'Child ' + (i + 1),
        children: Array.from({ length: 10 }, (_, j) => ({
          id: `${i + 1000}-${j + 1}`,
          label: `Grandchild ${j + 1}`,
        })),
      }
    }),
  },
]

export default () => {
  mountUi('.example-frame', (ui) => {
    let selectedId: string = null!
    ui.tree({
      data,
      adapter,
      style: {
        height: '400px',
      },
      get selectedId() {
        return selectedId
      },
      onSelect: (node) => {
        selectedId = adapter.nodeId(node)
        console.log('Selected node:', node, 'Selected ID:', selectedId)
      },
    })
  })
}
