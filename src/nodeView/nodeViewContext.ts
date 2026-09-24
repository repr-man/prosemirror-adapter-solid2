import type { Attrs, Node } from 'prosemirror-model'
import type { Decoration, DecorationSource, EditorView, NodeViewConstructor } from 'prosemirror-view'
import { createContext, useContext, type Accessor } from 'solid-js'

import type { SolidNodeViewUserOptions } from './SolidNodeViewOptions'

export type NodeViewContentRef = (element: HTMLElement | null) => void

export interface NodeViewContextProps {
  // won't change
  contentRef: NodeViewContentRef
  view: EditorView
  getPos: () => number | undefined
  setAttrs: (attrs: Attrs) => void

  // changes between updates
  node: Node
  selected: boolean
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource
}

export type NodeViewContext = Accessor<NodeViewContextProps>

export const nodeViewContext = createContext<NodeViewContext>()

export const useNodeViewContext = () => useContext(nodeViewContext)

export const createNodeViewContext = createContext<(options: SolidNodeViewUserOptions) => NodeViewConstructor>()

export const useNodeViewFactory = () => useContext(createNodeViewContext)
