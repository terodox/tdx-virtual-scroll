# tdx-virtual-scroll

A virtual scroll web component

## Notes

### tdx-virtual-scroll requires fixed height elements

All elements needs to be the same height to allow proper calculation of the "empty space" above the visible elements.

### tdx-virtual-infinite-scroll === Top down and everything is rendered

This virtual scroll component is built to handle top down scrolling. There is an expectation that every element will be rendered.

Why?

Glad you asked! To properly calculate the height of dynamic content we need to render and get it's height. Knowing the height of each element is needed to figure out the "empty space" above the visible elements.
