import { CoreMarkView, type CoreMarkViewSpec } from '@prosemirror-adapter/core'
import type { JSX } from '@solidjs/web'
import type { Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { Portal, dynamic } from '@solidjs/web'

import type { SolidRenderer } from '../SolidRenderer'
import { hidePortalDiv } from '../utils/hidePortalDiv'

import type { MarkViewContext, MarkViewContextProps } from './markViewContext'
import { markViewContext } from './markViewContext'
import type { SolidMarkViewComponent } from './SolidMarkViewOptions'

const MarkViewProvider = markViewContext

/**
 * @internal
 */
export abstract class AbstractSolidMarkView<ComponentType>
  extends CoreMarkView<ComponentType>
  implements SolidRenderer<MarkViewContext>
{
  context: MarkViewContext

  protected setContext: Setter<MarkViewContextProps>

  constructor(spec: CoreMarkViewSpec<ComponentType>) {
    super(spec)
    const [context, setContext] = createSignal<MarkViewContextProps>({
      contentRef: this.contentRef,
      view: this.view,
      mark: this.mark,
    })

    this.context = context
    this.setContext = setContext
  }

  updateContext = () => {
    this.setContext((prev) => ({
      ...prev,
      mark: this.mark,
    }))
  }

  abstract render: () => JSX.Element
}

export class SolidMarkView
  extends AbstractSolidMarkView<SolidMarkViewComponent>
  implements SolidRenderer<MarkViewContext>
{
  render = () => {
    const UserComponent = dynamic(() => this.component)

    return (
      <Portal mount={this.dom} ref={(el: HTMLElement) => hidePortalDiv(el)}>
        <MarkViewProvider value={this.context}>
          <UserComponent />
        </MarkViewProvider>
      </Portal>
    )
  }
}
