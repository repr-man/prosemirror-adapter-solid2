import type { Mark } from 'prosemirror-model'
import type { EditorView, MarkViewConstructor } from 'prosemirror-view'
import { createContext, useContext, type Accessor } from 'solid-js'

import type { SolidMarkViewUserOptions } from './SolidMarkViewOptions'

export type MarkViewContentRef = (element: HTMLElement | null) => void

export interface MarkViewContextProps {
  // won't change
  contentRef: MarkViewContentRef
  view: EditorView
  mark: Mark
}

export type MarkViewContext = Accessor<MarkViewContextProps>

export const markViewContext = createContext<MarkViewContext>()

export const useMarkViewContext = () => useContext(markViewContext)

export const createMarkViewContext = createContext<(options: SolidMarkViewUserOptions) => MarkViewConstructor>()

export const useMarkViewFactory = () => useContext(createMarkViewContext)
