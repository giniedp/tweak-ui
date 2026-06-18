import m, { Children, FactoryComponent, Vnode, VnodeDOM } from 'mithril'
import { StatsConfig, statsRenderer, StatsRenderer } from '../../stats'

export interface GraphAttrs extends Partial<StatsConfig> {
  rowHeight?: number
}

export function uiGraph(attrs: GraphAttrs, children?: Children): Vnode<GraphAttrs> {
  return m(GraphComponent, attrs, children)
}

export const GraphComponent: FactoryComponent<GraphAttrs> = () => {
  let observer: ResizeObserver | null = null
  let frameId: number | null = null
  let canvas: HTMLCanvasElement | null = null
  let renderer: StatsRenderer
  let config: StatsConfig = { rows: [] }
  let legendNodes: HTMLDivElement[] = []
  let legendTimer: number | null = null

  function connect(el: HTMLCanvasElement) {
    canvas = el
    observer?.observe(canvas)
    updateGraph()
    legendTimer = setInterval(updateLegend, 250)
  }

  function disconnect() {
    observer?.disconnect()
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
    if (legendTimer !== null) {
      clearInterval(legendTimer)
      legendTimer = null
    }
  }

  function updateGraph() {
    if (canvas?.isConnected) {
      renderer.update()
      renderer.render()
      frameId = requestAnimationFrame(updateGraph)
    } else {
      disconnect()
    }
  }

  function updateLegend() {
    renderLegend(renderer, legendNodes)
  }

  function canvasCreated({ dom }: VnodeDOM) {
    disconnect()
    const canvas = dom as HTMLCanvasElement
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error('Graph component must be a canvas element')
      return
    }
    observer = new ResizeObserver((entries) => {
      const size = sizeFromObserver(entries)
      if (size && renderer) {
        renderer.resize(size.width, size.height)
      }
    })
    renderer = statsRenderer(canvas)
    for (let i = 0; i < config.rows.length; i++) {
      config.rows[i].color ||= colorForIndex(i)
    }
    renderer.configure(config)
    connect(canvas)
  }

  function cavasRemoved() {
    disconnect()
  }

  function updateConfig(node: Vnode<GraphAttrs>) {
    config = {
      ...node.attrs,
      rows: (node.attrs.rows || []).map((r, i) => {
        return {
          ...r,
          name: r.name || `Row ${i + 1}`,
          color: r.color || colorForIndex(i),
        }
      }),
    }
  }
  return {
    oninit: updateConfig,
    onupdate: updateConfig,
    onremove: () => {
      disconnect()
    },
    view: ({ attrs: { rowHeight, collapsed } }) => {
      const height = (rowHeight || 50) * (collapsed ? 1 : config.rows.length) * devicePixelRatio
      return [
        m('canvas.twui-graph', {
          style: `width: 100%; height: ${height}px`,
          oncreate: canvasCreated,
          onremove: cavasRemoved,
        }),
        m('table.twui-graph', {}, [
          m(
            'tbody',
            {},
            config.rows.map((r, i) => {
              return m(
                'tr',
                {
                  oncreate: ({ dom }) => (legendNodes[i] = dom as HTMLDivElement),
                },
                [
                  m('td', { style: r.noGraph ? {} : `color: ${r.color}`, title: r.name! }, [
                    m('span', r.name!),
                  ]),
                  m('td.twui-stats', { title: 'min / max / avg' }, []),
                  m('td.twui-current', {}),
                ],
              )
            }),
          ),
        ]),
      ]
    },
  }
}

function sizeFromObserver(entries: ResizeObserverEntry[]) {
  const entry = entries[0]
  if (entry.devicePixelContentBoxSize) {
    const width = entry.devicePixelContentBoxSize[0].inlineSize
    const height = entry.devicePixelContentBoxSize[0].blockSize
    return { width, height }
  }
  if (entry.contentBoxSize) {
    const width = Math.round(entry.contentBoxSize[0].inlineSize * devicePixelRatio)
    const height = Math.round(entry.contentBoxSize[0].blockSize * devicePixelRatio)
    return { width, height }
  }
  return null
}

function renderLegend(renderer: StatsRenderer | null, nodes: HTMLElement[]) {
  if (!renderer) {
    return
  }

  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i]
    const sampler = renderer.sampler(i)
    if (!sampler || !el) {
      continue
    }

    const current = el.querySelector('.twui-current')
    const stats = el.querySelector('.twui-stats')
    if (current) {
      current.textContent = formatValue(sampler.value, sampler.fractionDigits)
    }
    if (stats) {
      if (sampler.noGraph) {
        stats.textContent = ''
      } else {
        const fd = sampler.fractionDigits
        stats.textContent = `${formatValue(sampler.minSeen, fd)}/${formatValue(sampler.maxSeen, fd)}/${formatValue(sampler.avg, fd)}`
      }
    }
  }
}

function formatValue(value: number | null, fractionDigits?: number): string {
  if (value == null) {
    return 'n/a'
  }
  if (fractionDigits != null) {
    return value.toFixed(fractionDigits)
  }
  const abs = Math.abs(value)
  if (abs < Number.EPSILON) {
    return '0'
  }
  if (abs < 1) {
    return value.toFixed(3)
  }
  if (abs < 10) {
    return value.toFixed(2)
  }
  if (abs < 100) {
    return value.toFixed(1)
  }
  return value.toFixed(0)
}

const DEFAULT_COLORS = [
  '#1F77B4', // deep blue
  '#FF7F0E', // orange
  '#2CA02C', // strong green
  '#D62728', // strong red
  '#9467BD', // violet
  '#8C564B', // muted brown
  '#E377C2', // magenta
  '#7F7F7F', // neutral gray

  '#5DA5DA', // blue
  '#F17CB0', // pink
  '#60BD68', // green
  '#B2912F', // brown/gold
  '#B276B2', // purple
  '#DECF3F', // yellow
  '#F15854', // red
  '#4D4D4D', // gray

  '#17BECF', // cyan
  '#AEC7E8', // light blue
  '#FFBB78', // light orange
  '#98DF8A', // light green
]

function colorForIndex(i: number): string {
  return DEFAULT_COLORS[i % DEFAULT_COLORS.length]
}
