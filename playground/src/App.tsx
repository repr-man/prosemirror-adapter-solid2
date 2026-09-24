import { For, Show, createSignal, onSettled } from 'solid-js'
import { EditorState, type Command, type Transaction } from 'prosemirror-state'
import { Schema, type Node as ProseMirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { baseKeymap, setBlockType, toggleMark, wrapIn } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

import {
  ProsemirrorAdapterProvider,
  useNodeViewContext,
  useNodeViewFactory,
} from '../../src/index'

const schema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block').append({
    counter: {
      group: 'block',
      atom: true,
      attrs: { count: { default: 0 } },
      parseDOM: [{ tag: 'div[data-counter]' }],
      toDOM: (node) => ['div', { 'data-counter': 'true' }, `Counter: ${node.attrs.count}`],
    },
  }),
  marks: basicSchema.spec.marks,
})

const initialDoc = schema.nodeFromJSON({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'A rich-text editor powered by Solid 2' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Click this text to edit it. Try selecting a phrase, then use the toolbar to make it bold or italic.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Use the block controls to turn this paragraph into a heading, list, or quote.' }],
    },
    { type: 'counter', attrs: { count: 0 } },
  ],
})

type EventKind = 'mount' | 'text' | 'format' | 'counter' | 'system'

type EditorEvent = {
  kind: EventKind
  message: string
}

const eventColors: Record<EventKind, string> = {
  mount: '#1d4ed8',
  text: '#475569',
  format: '#7c3aed',
  counter: '#b45309',
  system: '#0f766e',
}

function CounterNodeView() {
  const context = useNodeViewContext()
  const count = () => context?.().node.attrs.count ?? 0

  const increment = () => {
    const nodeView = context?.()
    if (!nodeView) return

    nodeView.setAttrs({ count: Number(nodeView.node.attrs.count) + 1 })
  }

  return (
    <div
      data-testid="counter-node-view"
      style={{
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        gap: '12px',
        padding: '16px 18px',
        border: '1px solid #f59e0b',
        'border-radius': '12px',
        background: '#fffbeb',
      }}
    >
      <div>
        <strong style={{ display: 'block', color: '#92400e' }}>Custom node view</strong>
        <span style={{ color: '#78350f', 'font-size': '14px' }}>Solid component with ProseMirror attrs</span>
      </div>
      <div style={{ display: 'flex', 'align-items': 'center', gap: '12px' }}>
        <span data-testid="counter-value" aria-live="polite" style={{ 'font-weight': 700, color: '#92400e' }}>
          Count: {count()}
        </span>
        <button
          type="button"
          data-testid="counter-increment"
          aria-label="Increment custom node view counter"
          onClick={increment}
          style={{
            border: '1px solid #d97706',
            'border-radius': '8px',
            padding: '8px 12px',
            background: '#f59e0b',
            color: '#451a03',
            'font-weight': 700,
            cursor: 'pointer',
          }}
        >
          Increment attrs
        </button>
      </div>
    </div>
  )
}

function ToolbarButton(props: {
  testId: string
  label: string
  onCommand: () => void
}) {
  return (
    <button
      type="button"
      data-testid={props.testId}
      aria-label={props.label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => props.onCommand()}
      style={{
        border: '1px solid #cbd5e1',
        'border-radius': '7px',
        padding: '7px 10px',
        background: '#ffffff',
        color: '#1e293b',
        'font-size': '14px',
        'font-weight': 650,
        cursor: 'pointer',
      }}
    >
      {props.label}
    </button>
  )
}

function EditorPanel() {
  const nodeViewFactory = useNodeViewFactory()
  const [editorView, setEditorView] = createSignal<EditorView>()
  const [status, setStatus] = createSignal('Waiting for onSettled to mount the editor…')
  const [events, setEvents] = createSignal<EditorEvent[]>([])
  let mountedView: EditorView | undefined

  const record = (kind: EventKind, message: string) => {
    setEvents((previous) => [...previous.slice(-7), { kind, message }])
  }

  const counterValue = (doc: ProseMirrorNode) => {
    let count: number | undefined
    doc.descendants((node) => {
      if (node.type === schema.nodes.counter) {
        count = Number(node.attrs.count)
        return false
      }
      return true
    })
    return count
  }

  const describeTransaction = (previousDoc: ProseMirrorNode, nextState: EditorState, transaction: Transaction) => {
    if (!transaction.docChanged) return

    const previousCount = counterValue(previousDoc)
    const nextCount = counterValue(nextState.doc)
    const formatLabel = transaction.getMeta('playground:format') as string | undefined

    if (previousCount !== nextCount && nextCount !== undefined) {
      setStatus(`Counter updated through Solid node view attrs: ${nextCount}`)
      record('counter', `Counter attrs updated to ${nextCount}`)
    } else if (formatLabel) {
      setStatus(`Formatting command applied: ${formatLabel}`)
      record('format', `Formatting command: ${formatLabel}`)
    } else {
      setStatus('Text transaction applied to the ProseMirror document.')
      record('text', 'Text transaction applied')
    }
  }

  const mountEditor = (host: HTMLDivElement) => {
    mountedView?.destroy()
    host.replaceChildren()

    let view: EditorView
    view = new EditorView(host, {
      state: EditorState.create({
        schema,
        doc: initialDoc,
        plugins: [keymap(baseKeymap)],
      }),
      attributes: {
        id: 'editor-content',
        'aria-label': 'Rich text editor',
        'data-testid': 'editor-content',
        role: 'textbox',
      },
      nodeViews: {
        counter: nodeViewFactory!({ component: CounterNodeView, as: 'div' }),
      },
      dispatchTransaction: (transaction) => {
        const previousState = view.state
        const nextState = view.state.apply(transaction)
        view.updateState(nextState)
        describeTransaction(previousState.doc, nextState, transaction)
      },
    })

    Object.assign(view.dom.style, {
      minHeight: '260px',
      padding: '20px',
      outline: 'none',
      color: '#172033',
      'font-size': '17px',
      'line-height': '1.65',
      'white-space': 'pre-wrap',
      cursor: 'text',
    })

    mountedView = view
    setEditorView(view)
    setStatus('Editor mounted and ready for editing.')
    record('mount', 'EditorView mounted with the local adapter source')
  }

  const recreateEditor = () => {
    const host = document.getElementById('editor-host')
    if (host instanceof HTMLDivElement) {
      mountEditor(host)
      record('system', 'Editor reset / recreated with the initial document')
    }
  }

  const runCommand = (label: string, command: Command) => {
    const view = mountedView
    if (!view) return

    command(view.state, (transaction) => {
      view.dispatch(transaction.setMeta('playground:format', label))
    })
    view.focus()
  }

  onSettled(() => {
    const host = document.getElementById('editor-host')
    if (!(host instanceof HTMLDivElement)) {
      setStatus('Error: editor host was not found.')
      record('system', 'Editor host was not found')
      return
    }

    mountEditor(host)

    return () => {
      mountedView?.destroy()
      mountedView = undefined
    }
  })

  return (
    <section aria-label="Rich text editor playground">
      <div
        role="toolbar"
        aria-label="Formatting toolbar"
        data-testid="formatting-toolbar"
        style={{
          display: 'flex',
          'flex-wrap': 'wrap',
          gap: '8px',
          padding: '12px',
          border: '1px solid #cbd5e1',
          'border-bottom': 'none',
          'border-radius': '12px 12px 0 0',
          background: '#f8fafc',
        }}
      >
        <ToolbarButton
          testId="toolbar-bold"
          label="Bold"
          onCommand={() => runCommand('Bold', toggleMark(schema.marks.strong))}
        />
        <ToolbarButton
          testId="toolbar-italic"
          label="Italic"
          onCommand={() => runCommand('Italic', toggleMark(schema.marks.em))}
        />
        <ToolbarButton
          testId="toolbar-heading"
          label="Heading"
          onCommand={() => runCommand('Heading', setBlockType(schema.nodes.heading, { level: 2 }))}
        />
        <ToolbarButton
          testId="toolbar-paragraph"
          label="Paragraph"
          onCommand={() => runCommand('Paragraph', setBlockType(schema.nodes.paragraph))}
        />
        <ToolbarButton
          testId="toolbar-bullet-list"
          label="Bullet list"
          onCommand={() => runCommand('Bullet list', wrapIn(schema.nodes.bullet_list))}
        />
        <ToolbarButton
          testId="toolbar-blockquote"
          label="Blockquote"
          onCommand={() => runCommand('Blockquote', wrapIn(schema.nodes.blockquote))}
        />
      </div>

      <div
        style={{
          border: '1px solid #cbd5e1',
          'border-radius': '0 0 12px 12px',
          background: '#ffffff',
          'box-shadow': '0 8px 24px rgba(15, 23, 42, 0.08)',
        }}
      >
        <label
          for="editor-content"
          style={{
            display: 'block',
            padding: '12px 20px 0',
            color: '#475569',
            'font-size': '13px',
            'font-weight': 700,
            'letter-spacing': '0.04em',
            'text-transform': 'uppercase',
          }}
        >
          Content editor
        </label>
        <div
          id="editor-host"
          data-testid="editor-host"
          aria-label="Rich text editor surface"
          style={{ padding: '0 0 10px' }}
        />
      </div>

      <div style={{ display: 'flex', 'align-items': 'center', gap: '12px', 'margin-top': '16px' }}>
        <button
          type="button"
          data-testid="reset-editor"
          aria-label="Reset and recreate editor"
          onClick={recreateEditor}
          style={{
            border: '1px solid #0f766e',
            'border-radius': '8px',
            padding: '9px 13px',
            background: '#0f766e',
            color: '#ffffff',
            'font-weight': 700,
            cursor: 'pointer',
          }}
        >
          Reset / recreate editor
        </button>
        <Show when={editorView()} fallback={<span data-testid="editor-loading">Editor is starting…</span>}>
          <span data-testid="editor-ready" style={{ color: '#087443', 'font-weight': 700 }}>
            ✓ Ready
          </span>
        </Show>
      </div>

      <p data-testid="editor-status" aria-live="polite" style={{ margin: '14px 0', color: '#334155' }}>
        {status()}
      </p>

      <div
        data-testid="event-feedback"
        aria-label="Editor event feedback"
        style={{
          padding: '14px 16px',
          border: '1px solid #dbe4ee',
          'border-radius': '10px',
          background: '#f8fafc',
        }}
      >
        <strong>Event feedback</strong>
        <ul data-testid="event-log" style={{ margin: '8px 0 0', padding: '0 0 0 20px' }}>
          <For each={events()}>
            {(event) => <li style={{ color: eventColors[event.kind] }}>{event.message}</li>}
          </For>
        </ul>
      </div>
    </section>
  )
}

export function App() {
  return (
    <main
      style={{
        'max-width': '880px',
        margin: '0 auto',
        padding: '36px 20px 56px',
        color: '#172033',
        'font-family': 'system-ui, sans-serif',
        'line-height': '1.5',
      }}
    >
      <header style={{ 'margin-bottom': '24px' }}>
        <p style={{ margin: '0 0 8px', color: '#0f766e', 'font-size': '13px', 'font-weight': 800, 'letter-spacing': '0.08em', 'text-transform': 'uppercase' }}>
          Solid 2 + ProseMirror
        </p>
        <h1 style={{ margin: '0 0 8px', 'font-size': '32px', 'letter-spacing': '-0.02em' }}>
          Rich-text editor playground
        </h1>
        <p style={{ margin: 0, color: '#475569', 'font-size': '17px' }}>
          Edit the starter content, apply formatting, and watch the local adapter report each event below.
        </p>
      </header>
      <ProsemirrorAdapterProvider>
        <EditorPanel />
      </ProsemirrorAdapterProvider>
    </main>
  )
}
