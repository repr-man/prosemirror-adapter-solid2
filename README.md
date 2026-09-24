# @prosemirror-adapter/solid

[Solid 2](https://v2.solidjs.com/) adapter for [ProseMirror](https://prosemirror.net/).

## Install

```bash
pnpm add @prosemirror-adapter/solid @solidjs/web solid-js
```

The adapter uses the Solid 2 renderer boundary (`@solidjs/web`) and requires Solid 2-compatible versions of both `solid-js` and `@solidjs/web`.

## Usage

Wrap the editor in `ProsemirrorAdapterProvider`, then use the factory matching the ProseMirror view you are creating:

```tsx
import {
  ProsemirrorAdapterProvider,
  useNodeViewFactory,
} from '@prosemirror-adapter/solid'

function Editor() {
  const nodeViewFactory = useNodeViewFactory()

  // Pass nodeViewFactory({ component: YourNodeView }) to ProseMirror's nodeViews.
  return <div ref={(element) => createEditor(element, nodeViewFactory)} />
}

export function App() {
  return (
    <ProsemirrorAdapterProvider>
      <Editor />
    </ProsemirrorAdapterProvider>
  )
}
```

Inside a view component, context hooks return Solid accessors. For example:

```tsx
import { useNodeViewContext } from '@prosemirror-adapter/solid'

function YourNodeView() {
  const context = useNodeViewContext()
  return <div ref={context().contentRef}>{context().node.type.name}</div>
}
```

The package preserves the upstream node, mark, widget, and plugin view APIs. See the exported `use*ViewFactory` and `use*ViewContext` functions for the complete surface.

## Development

```bash
pnpm install
pnpm run typecheck
pnpm run lint
pnpm run build
```
