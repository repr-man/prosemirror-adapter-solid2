import { type Component, For, type ParentProps } from 'solid-js'

import { createMarkViewContext } from './markView'
import { useSolidMarkViewCreator } from './markView/useSolidMarkViewCreator'
import { createNodeViewContext } from './nodeView'
import { useSolidNodeViewCreator } from './nodeView/useSolidNodeViewCreator'
import { createPluginViewContext } from './pluginView'
import { useSolidPluginViewCreator } from './pluginView/useSolidPluginViewCreator'
import { useSolidRenderer } from './SolidRenderer'
import { createWidgetViewContext } from './widgetView'
import { useSolidWidgetViewCreator } from './widgetView/useSolidWidgetViewCreator'

const NodeViewProvider = createNodeViewContext
const MarkViewProvider = createMarkViewContext
const WidgetViewProvider = createWidgetViewContext
const PluginViewProvider = createPluginViewContext

export const ProsemirrorAdapterProvider: Component<ParentProps> = (props) => {
  const { renderSolidRenderer, removeSolidRenderer, render } = useSolidRenderer()

  const createSolidNodeView = useSolidNodeViewCreator(renderSolidRenderer, removeSolidRenderer)

  const createSolidMarkView = useSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer)

  const createSolidWidgetView = useSolidWidgetViewCreator(renderSolidRenderer, removeSolidRenderer)

  const createSolidPluginView = useSolidPluginViewCreator(renderSolidRenderer, removeSolidRenderer)

  return (
    <NodeViewProvider value={createSolidNodeView}>
      <MarkViewProvider value={createSolidMarkView}>
        <WidgetViewProvider value={createSolidWidgetView}>
          <PluginViewProvider value={createSolidPluginView}>
            {props.children}
            <For each={render()}>{(node) => node}</For>
          </PluginViewProvider>
        </WidgetViewProvider>
      </MarkViewProvider>
    </NodeViewProvider>
  )
}
