import { softBinarySearch } from './soft-binary-search';

export function calculateView({
  itemOffsets,
  offsetTop,
  visibleItemCount,
}: {
  itemOffsets: number[];
  offsetTop: number;
  visibleItemCount: number;
}) {
  const lowestVisibleNodeIndex = softBinarySearch(offsetTop, itemOffsets);

  let startNodeIndex = lowestVisibleNodeIndex - 5;
  if (startNodeIndex - 5 <= 0) {
    startNodeIndex = 0;
  }

  const visibleAreaOffsetTop = itemOffsets[lowestVisibleNodeIndex];

  let highestVisibleIndex = lowestVisibleNodeIndex + visibleItemCount;
  if (highestVisibleIndex > itemOffsets.length - 1) {
    highestVisibleIndex = itemOffsets.length - 1;
  }

  const contentAreaHeight = itemOffsets[highestVisibleIndex];

  return {
    contentAreaHeight,
    startNodeIndex,
    visibleAreaOffsetTop,
  };
}
