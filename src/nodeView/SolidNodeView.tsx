import { CoreNodeView, type CoreNodeViewSpec } from '@prosemirror-adapter/core'
import type { JSX } from '@solidjs/web'
import type { Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { Portal, dynamic } from '@solidjs/web'

import type { SolidRenderer } from '../SolidRenderer'
import { hidePortalDiv } from '../utils/hidePortalDiv'

import type { NodeViewContext, NodeViewContextProps } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'
import type { SolidNodeViewComponent } from './SolidNodeViewOptions'

const NodeViewProvider = nodeViewContext

/**
 * @internal
 */
export abstract class AbstractSolidNodeView<ComponentType>
  extends CoreNodeView<ComponentType>
  implements SolidRenderer<NodeViewContext>
{
  context: NodeViewContext

  protected setContext: Setter<NodeViewContextProps>

  constructor(spec: CoreNodeViewSpec<ComponentType>) {
    super(spec)
    const [context, setContext] = createSignal<NodeViewContextProps>({
      contentRef: this.contentRef,
      view: this.view,
      getPos: this.getPos,
      setAttrs: this.setAttrs,
      node: this.node,
      selected: this.selected,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
    })

    this.context = context
    this.setContext = setContext
  }

  updateContext = () => {
    this.setContext((prev) => ({
      ...prev,
      node: this.node,
      selected: this.selected,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
    }))
  }

  abstract render: () => JSX.Element
}

export class SolidNodeView
  extends AbstractSolidNodeView<SolidNodeViewComponent>
  implements SolidRenderer<NodeViewContext>
{
  render = () => {
    const UserComponent = dynamic(() => this.component)

    return (
      <Portal mount={this.dom} ref={(el: HTMLElement) => hidePortalDiv(el)}>
        <NodeViewProvider value={this.context}>
          <UserComponent />
        </NodeViewProvider>
      </Portal>
    )
  }
}
