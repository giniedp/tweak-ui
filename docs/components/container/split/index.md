# Split

Divides an area into resizable panes separated by draggable gutters. Set `flow` to `'row'`
(side by side) or `'column'` (stacked, the default). Panes can be nested to build more
complex layouts, like the sidebar + editor/console arrangement below.

- `minSize` limits how far a pane can be dragged before it stops shrinking.
- Wrap a pane's content in `uiSplitContent({ fluid: true }, ...)` (or `ui.splitContent` in
  the builder) to have it absorb any extra space instead of keeping the size it was last
  dragged to.

<Example/>

<ExampleCode/>
