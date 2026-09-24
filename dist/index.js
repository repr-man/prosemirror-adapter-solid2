import { For, createContext, createMemo, createSignal, getOwner, onCleanup, runWithOwner, useContext } from "solid-js";
import { Portal, createComponent, dynamic, memo } from "@solidjs/web";
import { CoreMarkView, CoreNodeView, CorePluginView, CoreWidgetView } from "@prosemirror-adapter/core";
import { Decoration } from "prosemirror-view";
//#region src/markView/markViewContext.ts
var markViewContext = createContext();
var useMarkViewContext = () => useContext(markViewContext);
var createMarkViewContext = createContext();
var useMarkViewFactory = () => useContext(createMarkViewContext);
//#endregion
//#region src/utils/hidePortalDiv.ts
var hidePortalDiv = (x) => x.style.display = "contents";
//#endregion
//#region src/markView/SolidMarkView.tsx
var MarkViewProvider$1 = markViewContext;
/**
* @internal
*/
var AbstractSolidMarkView = class extends CoreMarkView {
	context;
	setContext;
	constructor(spec) {
		super(spec);
		const [context, setContext] = createSignal({
			contentRef: this.contentRef,
			view: this.view,
			mark: this.mark
		});
		this.context = context;
		this.setContext = setContext;
	}
	updateContext = () => {
		this.setContext((prev) => ({
			...prev,
			mark: this.mark
		}));
	};
};
var SolidMarkView = class extends AbstractSolidMarkView {
	render = () => {
		const _self$ = this;
		const UserComponent = dynamic(() => this.component);
		return createComponent(Portal, {
			get mount() {
				return _self$.dom;
			},
			ref: (el) => hidePortalDiv(el),
			get children() {
				return createComponent(MarkViewProvider$1, {
					get value() {
						return _self$.context;
					},
					get children() {
						return createComponent(UserComponent, {});
					}
				});
			}
		});
	};
};
//#endregion
//#region src/markView/useSolidMarkViewCreator.ts
/**
* @internal
*/
function buildSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer, SolidMarkViewClass) {
	return function markViewCreator(userOptions) {
		return function markViewConstructor(mark, view, inline) {
			const markView = new SolidMarkViewClass({
				mark,
				view,
				inline,
				options: {
					...userOptions,
					destroy() {
						userOptions.destroy?.();
						removeSolidRenderer(markView);
					}
				}
			});
			renderSolidRenderer(markView, false);
			return markView;
		};
	};
}
function useSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer) {
	return buildSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer, SolidMarkView);
}
//#endregion
//#region src/nodeView/nodeViewContext.ts
var nodeViewContext = createContext();
var useNodeViewContext = () => useContext(nodeViewContext);
var createNodeViewContext = createContext();
var useNodeViewFactory = () => useContext(createNodeViewContext);
//#endregion
//#region src/nodeView/SolidNodeView.tsx
var NodeViewProvider$1 = nodeViewContext;
/**
* @internal
*/
var AbstractSolidNodeView = class extends CoreNodeView {
	context;
	setContext;
	constructor(spec) {
		super(spec);
		const [context, setContext] = createSignal({
			contentRef: this.contentRef,
			view: this.view,
			getPos: this.getPos,
			setAttrs: this.setAttrs,
			node: this.node,
			selected: this.selected,
			decorations: this.decorations,
			innerDecorations: this.innerDecorations
		});
		this.context = context;
		this.setContext = setContext;
	}
	updateContext = () => {
		this.setContext((prev) => ({
			...prev,
			node: this.node,
			selected: this.selected,
			decorations: this.decorations,
			innerDecorations: this.innerDecorations
		}));
	};
};
var SolidNodeView = class extends AbstractSolidNodeView {
	render = () => {
		const _self$ = this;
		const UserComponent = dynamic(() => this.component);
		return createComponent(Portal, {
			get mount() {
				return _self$.dom;
			},
			ref: (el) => hidePortalDiv(el),
			get children() {
				return createComponent(NodeViewProvider$1, {
					get value() {
						return _self$.context;
					},
					get children() {
						return createComponent(UserComponent, {});
					}
				});
			}
		});
	};
};
//#endregion
//#region src/nodeView/useSolidNodeViewCreator.ts
/**
* @internal
*/
function buildSolidNodeViewCreator(renderSolidRenderer, removeSolidRenderer, SolidNodeViewClass) {
	return function nodeViewCreator(userOptions) {
		return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
			const nodeView = new SolidNodeViewClass({
				node,
				view,
				getPos,
				decorations,
				innerDecorations,
				options: {
					...userOptions,
					onUpdate() {
						userOptions.onUpdate?.();
						nodeView.updateContext();
					},
					selectNode() {
						userOptions.selectNode?.();
						nodeView.updateContext();
					},
					deselectNode() {
						userOptions.deselectNode?.();
						nodeView.updateContext();
					},
					destroy() {
						userOptions.destroy?.();
						removeSolidRenderer(nodeView);
					}
				}
			});
			renderSolidRenderer(nodeView, false);
			return nodeView;
		};
	};
}
function useSolidNodeViewCreator(renderSolidRenderer, removeSolidRenderer) {
	return buildSolidNodeViewCreator(renderSolidRenderer, removeSolidRenderer, SolidNodeView);
}
//#endregion
//#region src/pluginView/pluginViewContext.ts
var pluginViewContext = createContext();
var usePluginViewContext = () => useContext(pluginViewContext);
var createPluginViewContext = createContext();
var usePluginViewFactory = () => useContext(createPluginViewContext);
//#endregion
//#region src/pluginView/SolidPluginView.tsx
var PluginViewProvider$1 = pluginViewContext;
var SolidPluginView = class extends CorePluginView {
	context;
	setContext;
	constructor(spec) {
		super(spec);
		const [context, setContext] = createSignal({
			view: this.view,
			prevState: this.prevState
		});
		this.context = context;
		this.setContext = setContext;
	}
	updateContext = () => {
		this.setContext(() => ({
			view: this.view,
			prevState: this.prevState
		}));
	};
	render = () => {
		const _self$ = this;
		const UserComponent = dynamic(() => this.component);
		return createComponent(Portal, {
			get mount() {
				return _self$.root;
			},
			ref: (el) => hidePortalDiv(el),
			get children() {
				return createComponent(PluginViewProvider$1, {
					get value() {
						return _self$.context;
					},
					get children() {
						return createComponent(UserComponent, {});
					}
				});
			}
		});
	};
};
//#endregion
//#region src/pluginView/useSolidPluginViewCreator.ts
function useSolidPluginViewCreator(renderSolidRenderer, removeSolidRenderer) {
	const createSolidPluginView = (options) => {
		return (view) => {
			const pluginView = new SolidPluginView({
				view,
				options: {
					...options,
					update: (view, prevState) => {
						options.update?.(view, prevState);
						pluginView.updateContext();
					},
					destroy: () => {
						options.destroy?.();
						removeSolidRenderer(pluginView);
					}
				}
			});
			renderSolidRenderer(pluginView);
			return pluginView;
		};
	};
	return createSolidPluginView;
}
//#endregion
//#region src/SolidRenderer.ts
function updateRenderer(state, renderer) {
	const [keys, nodes] = state;
	const newKey = renderer.key;
	const newNode = renderer.render();
	const index = keys.indexOf(newKey);
	if (index === -1) return [[...keys, newKey], [...nodes, newNode]];
	else {
		const newNodes = [...nodes];
		newNodes[index] = newNode;
		return [keys, newNodes];
	}
}
function removeRenderer(state, renderer) {
	const [keys, nodes] = state;
	const index = keys.indexOf(renderer.key);
	if (index === -1) return state;
	const newKeys = [...keys];
	const newNodes = [...nodes];
	newKeys.splice(index, 1);
	newNodes.splice(index, 1);
	return [newKeys, newNodes];
}
/**
* @internal
*/
function useSolidRenderer() {
	const [portalState, setPortalState] = createSignal([[], []]);
	const owner = getOwner();
	const renderSolidRenderer = (nodeView, update = true) => {
		if (update) nodeView.updateContext();
		setPortalState((prev) => runWithOwner(owner, () => updateRenderer(prev, nodeView)));
	};
	const removeSolidRenderer = (nodeView) => {
		setPortalState((prev) => removeRenderer(prev, nodeView));
	};
	onCleanup(() => {
		setPortalState([[], []]);
	});
	return {
		render: createMemo(() => portalState()[1]),
		renderSolidRenderer,
		removeSolidRenderer
	};
}
//#endregion
//#region src/widgetView/widgetViewContext.ts
var widgetViewContext = createContext();
var useWidgetViewContext = () => useContext(widgetViewContext);
var createWidgetViewContext = createContext();
var useWidgetViewFactory = () => useContext(createWidgetViewContext);
//#endregion
//#region src/widgetView/SolidWidgetView.tsx
var WidgetViewProvider$1 = widgetViewContext;
var SolidWidgetView = class extends CoreWidgetView {
	context;
	setContext;
	constructor(spec) {
		super(spec);
		const [context, setContext] = createSignal({
			view: this.view,
			getPos: this.getPos,
			spec: this.spec
		});
		this.context = context;
		this.setContext = setContext;
	}
	updateContext = () => {
		this.setContext(() => ({
			view: this.view,
			getPos: this.getPos,
			spec: this.spec
		}));
	};
	render = () => {
		const _self$ = this;
		const UserComponent = dynamic(() => this.component);
		return createComponent(Portal, {
			get mount() {
				return _self$.dom;
			},
			ref: (el) => hidePortalDiv(el),
			get children() {
				return createComponent(WidgetViewProvider$1, {
					get value() {
						return _self$.context;
					},
					get children() {
						return createComponent(UserComponent, {});
					}
				});
			}
		});
	};
};
//#endregion
//#region src/widgetView/useSolidWidgetViewCreator.ts
function useSolidWidgetViewCreator(renderSolidRenderer, removeSolidRenderer) {
	const createWidgetPluginView = (options) => {
		return (pos, userSpec = {}) => {
			const widgetView = new SolidWidgetView({
				pos,
				options
			});
			const spec = {
				...userSpec,
				destroy: (node) => {
					userSpec.destroy?.(node);
					removeSolidRenderer(widgetView);
				}
			};
			widgetView.spec = spec;
			return Decoration.widget(pos, (view, getPos) => {
				widgetView.bind(view, getPos);
				widgetView.updateContext();
				renderSolidRenderer(widgetView);
				return widgetView.dom;
			}, spec);
		};
	};
	return createWidgetPluginView;
}
//#endregion
//#region src/Provider.tsx
var NodeViewProvider = createNodeViewContext;
var MarkViewProvider = createMarkViewContext;
var WidgetViewProvider = createWidgetViewContext;
var PluginViewProvider = createPluginViewContext;
var ProsemirrorAdapterProvider = (props) => {
	const { renderSolidRenderer, removeSolidRenderer, render } = useSolidRenderer();
	const createSolidNodeView = useSolidNodeViewCreator(renderSolidRenderer, removeSolidRenderer);
	const createSolidMarkView = useSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer);
	const createSolidWidgetView = useSolidWidgetViewCreator(renderSolidRenderer, removeSolidRenderer);
	const createSolidPluginView = useSolidPluginViewCreator(renderSolidRenderer, removeSolidRenderer);
	return createComponent(NodeViewProvider, {
		value: createSolidNodeView,
		get children() {
			return createComponent(MarkViewProvider, {
				value: createSolidMarkView,
				get children() {
					return createComponent(WidgetViewProvider, {
						value: createSolidWidgetView,
						get children() {
							return createComponent(PluginViewProvider, {
								value: createSolidPluginView,
								get children() {
									return [memo(() => {
										return props.children;
									}), createComponent(For, {
										get each() {
											return render();
										},
										children: (node) => node
									})];
								}
							});
						}
					});
				}
			});
		}
	});
};
//#endregion
export { AbstractSolidMarkView, AbstractSolidNodeView, ProsemirrorAdapterProvider, SolidMarkView, SolidNodeView, SolidPluginView, SolidWidgetView, buildSolidMarkViewCreator, buildSolidNodeViewCreator, createMarkViewContext, createNodeViewContext, createPluginViewContext, createWidgetViewContext, markViewContext, nodeViewContext, pluginViewContext, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useSolidRenderer, useWidgetViewContext, useWidgetViewFactory, widgetViewContext };
