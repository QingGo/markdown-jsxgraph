# Markdown Preview JSXGraph Support

Render interactive [JSXGraph](https://jsxgraph.org/) mathematical visualizations directly inside your VSCode Markdown Preview.

- VSCode marketplace: https://marketplace.visualstudio.com/items?itemName=QingGo.markdown-jsxgraph
- Open VSX: https://open-vsx.org/extension/QingGo/markdown-jsxgraph

![Example Visualization](images/example.png)

I use this extension to write my math blogs built with Hugo. https://qinggo.github.io/2026/03/22/matrix-geometry-from-unit-circle-to-deep-learning/

## Features

- **Native Integration**: Seamlessly renders `jsxgraph` fenced code blocks in Markdown.
- **Interactive**: Full support for mouse dragging, wheel zooming, and touch interactions.
- **Responsive**: Auto-scales to the width of your preview window.
- **Smart Auto-Fit**: Automatically adjusts the viewport to show all elements with perfect padding.
- **Smooth Zoom**: Optimized scroll sensitivity for a premium exploration experience.
- **Offline Capable**: Bundles JSXGraph core locally; no external CDN required.
- **Custom Global Functions**: Inject your own JavaScript helpers that work across all your JSXGraph blocks.
- **Built-in Matrix & Animation Helpers**: Includes preset `__jxg` functions for professional linear algebra visualizations.

## Usage

Create a fenced code block with the language `jsxgraph`. Within the block, use the provided `containerId` to initialize your board.

When calling `JXG.JSXGraph.initBoard` please use inner `containerId` variable.

```jsxgraph
var board = JXG.JSXGraph.initBoard(containerId, {
    boundingbox: [-5, 5, 5, -5],
    axis: true,
    showCopyright: false
});

var p1 = board.create('point', [-2, 2], { name: 'A', size: 4 });
var p2 = board.create('point', [3, -1], { name: 'B', size: 4 });
var line = board.create('line', [p1, p2], { strokeColor: 'blue' });
```

## Customization

### Global Custom Functions
You can define your own global functions in VSCode settings: `markdown-jsxgraph.customGlobalFunctions`. 

By default, the extension includes a suite of `__jxg` helpers (inspired by high-end math blogs) for:
- `__jxgCreateMatrix(board, x, y, title, getMatrixFn)`: Renders a beautiful LaTeX-style matrix.
- `__jxgRegisterAutoPlay(id, slider/board)`: Adds interactive play/pause controls to your animations.
- `__jxgOptimizedAnimate(boardId, renderFunc)`: High-performance animation loop with intersection observer support.

## Configuration Defaults

By default, the following settings are injected to ensure a great interactive experience:
- `pan: { enabled: true, needShift: false }`
- `zoom: { enabled: true, wheel: true, factorX: 1.05, factorY: 1.05, min: 0.05, max: 100 }`
- `board.zoomFit()` is automatically called after initialization (unless using a custom engine).

## License

This extension is licensed under the [MIT License](LICENSE).
JSXGraph itself is dual-licensed under [LGPL-3.0-or-later OR MIT](https://github.com/jsxgraph/jsxgraph/blob/master/LICENSE).
