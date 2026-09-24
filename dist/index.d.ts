import { Accessor, Component, ParentProps, Setter, ValidComponent } from "solid-js";
import { CoreMarkView, CoreMarkViewSpec, CoreMarkViewUserOptions, CoreNodeView, CoreNodeViewSpec, CoreNodeViewUserOptions, CorePluginView, CorePluginViewSpec, CorePluginViewUserOptions, CoreWidgetView, CoreWidgetViewSpec, CoreWidgetViewUserOptions, PluginViewSpec, WidgetDecorationFactory, WidgetDecorationSpec } from "@prosemirror-adapter/core";
import { JSX } from "@solidjs/web";
import { Decoration, DecorationSource, EditorView, MarkViewConstructor, NodeViewConstructor } from "prosemirror-view";
import { Attrs, Mark, Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
//#region src/markView/SolidMarkViewOptions.d.ts
type SolidMarkViewComponent = ValidComponent;
type SolidMarkViewSpec = CoreMarkViewSpec<SolidMarkViewComponent>;
type SolidMarkViewUserOptions = CoreMarkViewUserOptions<SolidMarkViewComponent>;
//#endregion
//#region src/markView/markViewContext.d.ts
type MarkViewContentRef = (element: HTMLElement | null) => void;
interface MarkViewContextProps {
  contentRef: MarkViewContentRef;
  view: EditorView;
  mark: Mark;
}
type MarkViewContext = Accessor<MarkViewContextProps>;
export declare const markViewContext: import("solid-js").Context<MarkViewContext>;
export declare const useMarkViewContext: () => MarkViewContext;
export declare const createMarkViewContext: import("solid-js").Context<(options: SolidMarkViewUserOptions) => MarkViewConstructor>;
export declare const useMarkViewFactory: () => (options: SolidMarkViewUserOptions) => MarkViewConstructor;
//#endregion
//#region src/SolidRenderer.d.ts
/**
 * @internal
 */
interface SolidRenderer<Context> {
  key: string;
  context: Context;
  render: () => JSX.Element;
  updateContext: () => void;
}
/**
 * @internal
 */
interface SolidRendererResult {
  readonly render: Accessor<JSX.Element[]>;
  readonly renderSolidRenderer: (nodeView: SolidRenderer<unknown>, update?: boolean) => void;
  readonly removeSolidRenderer: (nodeView: SolidRenderer<unknown>) => void;
}
/**
 * @internal
 */
export declare function useSolidRenderer(): SolidRendererResult;
//#endregion
//#region src/markView/SolidMarkView.d.ts
/**
 * @internal
 */
export declare abstract class AbstractSolidMarkView<ComponentType> extends CoreMarkView<ComponentType> implements SolidRenderer<MarkViewContext> {
  context: MarkViewContext;
  protected setContext: Setter<MarkViewContextProps>;
  constructor(spec: CoreMarkViewSpec<ComponentType>);
  updateContext: () => void;
  abstract render: () => JSX.Element;
}
export declare class SolidMarkView extends AbstractSolidMarkView<SolidMarkViewComponent> implements SolidRenderer<MarkViewContext> {
  render: () => JSX.Element;
}
//#endregion
//#region src/markView/useSolidMarkViewCreator.d.ts
/**
 * @internal
 */
export declare function buildSolidMarkViewCreator<ComponentType>(renderSolidRenderer: SolidRendererResult['renderSolidRenderer'], removeSolidRenderer: SolidRendererResult['removeSolidRenderer'], SolidMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractSolidMarkView<ComponentType>): (userOptions: CoreMarkViewUserOptions<ComponentType>) => MarkViewConstructor;
//#endregion
//#region src/nodeView/SolidNodeViewOptions.d.ts
type SolidNodeViewComponent = ValidComponent;
type SolidNodeViewSpec = CoreNodeViewSpec<SolidNodeViewComponent>;
type SolidNodeViewUserOptions = CoreNodeViewUserOptions<SolidNodeViewComponent>;
//#endregion
//#region src/nodeView/nodeViewContext.d.ts
type NodeViewContentRef = (element: HTMLElement | null) => void;
interface NodeViewContextProps {
  contentRef: NodeViewContentRef;
  view: EditorView;
  getPos: () => number | undefined;
  setAttrs: (attrs: Attrs) => void;
  node: Node;
  selected: boolean;
  decorations: readonly Decoration[];
  innerDecorations: DecorationSource;
}
type NodeViewContext = Accessor<NodeViewContextProps>;
export declare const nodeViewContext: import("solid-js").Context<NodeViewContext>;
export declare const useNodeViewContext: () => NodeViewContext;
export declare const createNodeViewContext: import("solid-js").Context<(options: SolidNodeViewUserOptions) => NodeViewConstructor>;
export declare const useNodeViewFactory: () => (options: SolidNodeViewUserOptions) => NodeViewConstructor;
//#endregion
//#region src/nodeView/SolidNodeView.d.ts
/**
 * @internal
 */
export declare abstract class AbstractSolidNodeView<ComponentType> extends CoreNodeView<ComponentType> implements SolidRenderer<NodeViewContext> {
  context: NodeViewContext;
  protected setContext: Setter<NodeViewContextProps>;
  constructor(spec: CoreNodeViewSpec<ComponentType>);
  updateContext: () => void;
  abstract render: () => JSX.Element;
}
export declare class SolidNodeView extends AbstractSolidNodeView<SolidNodeViewComponent> implements SolidRenderer<NodeViewContext> {
  render: () => JSX.Element;
}
//#endregion
//#region src/nodeView/useSolidNodeViewCreator.d.ts
/**
 * @internal
 */
export declare function buildSolidNodeViewCreator<ComponentType>(renderSolidRenderer: SolidRendererResult['renderSolidRenderer'], removeSolidRenderer: SolidRendererResult['removeSolidRenderer'], SolidNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractSolidNodeView<ComponentType>): (userOptions: CoreNodeViewUserOptions<ComponentType>) => NodeViewConstructor;
//#endregion
//#region src/pluginView/SolidPluginViewOptions.d.ts
type SolidPluginViewComponent = ValidComponent;
type SolidPluginViewSpec = CorePluginViewSpec<SolidPluginViewComponent>;
type SolidPluginViewUserOptions = CorePluginViewUserOptions<SolidPluginViewComponent>;
//#endregion
//#region src/pluginView/pluginViewContext.d.ts
type PluginViewContentRef = (element: HTMLElement | null) => void;
interface PluginViewContextProps {
  view: EditorView;
  prevState?: EditorState;
}
type PluginViewContext = Accessor<PluginViewContextProps>;
export declare const pluginViewContext: import("solid-js").Context<PluginViewContext>;
export declare const usePluginViewContext: () => PluginViewContext;
export declare const createPluginViewContext: import("solid-js").Context<(options: SolidPluginViewUserOptions) => PluginViewSpec>;
export declare const usePluginViewFactory: () => (options: SolidPluginViewUserOptions) => PluginViewSpec;
//#endregion
//#region src/pluginView/SolidPluginView.d.ts
export declare class SolidPluginView extends CorePluginView<SolidPluginViewComponent> implements SolidRenderer<PluginViewContext> {
  context: PluginViewContext;
  private setContext;
  constructor(spec: CorePluginViewSpec<SolidPluginViewComponent>);
  updateContext: () => void;
  render: () => JSX.Element;
}
//#endregion
//#region src/Provider.d.ts
export declare const ProsemirrorAdapterProvider: Component<ParentProps>;
//#endregion
//#region src/widgetView/SolidWidgetViewOptions.d.ts
type SolidWidgetViewComponent = ValidComponent;
type SolidWidgetViewSpec = CoreWidgetViewSpec<SolidWidgetViewComponent>;
type SolidWidgetViewUserOptions = CoreWidgetViewUserOptions<SolidWidgetViewComponent>;
//#endregion
//#region src/widgetView/widgetViewContext.d.ts
interface WidgetViewContextProps {
  view: EditorView;
  getPos: () => number | undefined;
  spec?: WidgetDecorationSpec;
}
type WidgetViewContext = Accessor<WidgetViewContextProps>;
export declare const widgetViewContext: import("solid-js").Context<WidgetViewContext>;
export declare const useWidgetViewContext: () => WidgetViewContext;
export declare const createWidgetViewContext: import("solid-js").Context<(options: SolidWidgetViewUserOptions) => WidgetDecorationFactory>;
export declare const useWidgetViewFactory: () => (options: SolidWidgetViewUserOptions) => WidgetDecorationFactory;
//#endregion
//#region src/widgetView/SolidWidgetView.d.ts
export declare class SolidWidgetView extends CoreWidgetView<SolidWidgetViewComponent> implements SolidRenderer<WidgetViewContext> {
  context: WidgetViewContext;
  private setContext;
  constructor(spec: CoreWidgetViewSpec<SolidWidgetViewComponent>);
  updateContext: () => void;
  render: () => JSX.Element;
}
//#endregion
export type { MarkViewContentRef, MarkViewContext, MarkViewContextProps, NodeViewContentRef, NodeViewContext, NodeViewContextProps, PluginViewContentRef, PluginViewContext, PluginViewContextProps, SolidMarkViewComponent, SolidMarkViewSpec, SolidMarkViewUserOptions, SolidNodeViewComponent, SolidNodeViewSpec, SolidNodeViewUserOptions, SolidPluginViewComponent, SolidPluginViewSpec, SolidPluginViewUserOptions, SolidRenderer, SolidRendererResult, SolidWidgetViewComponent, SolidWidgetViewSpec, SolidWidgetViewUserOptions, WidgetViewContext, WidgetViewContextProps };