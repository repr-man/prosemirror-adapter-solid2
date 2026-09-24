import type { CoreWidgetViewSpec } from '@prosemirror-adapter/core'
import { CoreWidgetView } from '@prosemirror-adapter/core'
import type { JSX } from '@solidjs/web'
import type { Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { Portal, dynamic } from '@solidjs/web'

import type { SolidRenderer } from '../SolidRenderer'
import { hidePortalDiv } from '../utils/hidePortalDiv'

import type { SolidWidgetViewComponent } from './SolidWidgetViewOptions'
import type { WidgetViewContext, WidgetViewContextProps } from './widgetViewContext'
import { widgetViewContext } from './widgetViewContext'

const WidgetViewProvider = widgetViewContext

export class SolidWidgetView
  extends CoreWidgetView<SolidWidgetViewComponent>
  implements SolidRenderer<WidgetViewContext>
{
  context: WidgetViewContext

  private setContext: Setter<WidgetViewContextProps>

  constructor(spec: CoreWidgetViewSpec<SolidWidgetViewComponent>) {
    super(spec)
    const [context, setContext] = createSignal<WidgetViewContextProps>({
      view: this.view!,
      getPos: this.getPos!,
      spec: this.spec,
    })
    this.context = context
    this.setContext = setContext
  }

  updateContext = () => {
    this.setContext(() => ({
      view: this.view!,
      getPos: this.getPos!,
      spec: this.spec,
    }))
  }

  render = (): JSX.Element => {
    const UserComponent = dynamic(() => this.component)

    return (
      <Portal mount={this.dom} ref={(el: HTMLElement) => hidePortalDiv(el)}>
        <WidgetViewProvider value={this.context}>
          <UserComponent />
        </WidgetViewProvider>
      </Portal>
    )
  }
}
