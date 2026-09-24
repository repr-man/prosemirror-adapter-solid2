import type { CorePluginViewSpec } from '@prosemirror-adapter/core'
import { CorePluginView } from '@prosemirror-adapter/core'
import type { JSX } from '@solidjs/web'
import type { Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { Portal, dynamic } from '@solidjs/web'

import type { SolidRenderer } from '../SolidRenderer'
import { hidePortalDiv } from '../utils/hidePortalDiv'

import type { PluginViewContext, PluginViewContextProps } from './pluginViewContext'
import { pluginViewContext } from './pluginViewContext'
import type { SolidPluginViewComponent } from './SolidPluginViewOptions'

const PluginViewProvider = pluginViewContext

export class SolidPluginView
  extends CorePluginView<SolidPluginViewComponent>
  implements SolidRenderer<PluginViewContext>
{
  context: PluginViewContext

  private setContext: Setter<PluginViewContextProps>

  constructor(spec: CorePluginViewSpec<SolidPluginViewComponent>) {
    super(spec)
    const [context, setContext] = createSignal<PluginViewContextProps>({
      view: this.view,
      prevState: this.prevState,
    })
    this.context = context
    this.setContext = setContext
  }

  updateContext = () => {
    this.setContext(() => ({
      view: this.view,
      prevState: this.prevState,
    }))
  }

  render = (): JSX.Element => {
    const UserComponent = dynamic(() => this.component)

    return (
      <Portal mount={this.root} ref={(el: HTMLElement) => hidePortalDiv(el)}>
        <PluginViewProvider value={this.context}>
          <UserComponent />
        </PluginViewProvider>
      </Portal>
    )
  }
}
