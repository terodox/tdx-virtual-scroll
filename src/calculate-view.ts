export function calculateView({
  itemCount,
  itemHeight,
  offsetTop,
  viewportHeight,
  viewportPadding,
}: {
  itemCount: number;
  itemHeight: number;
  offsetTop: number;
  viewportHeight: number;
  viewportPadding: number;
}) {
  const startNodeIndex = Math.ceil(offsetTop / (itemHeight - viewportPadding));
  const visibleAreaOffsetTop = Math.ceil(startNodeIndex * itemHeight);
  const visibleNodeCount =
    Math.ceil(viewportHeight / itemHeight) - 2 * viewportPadding;

  return {
    startNodeIndex,
    visibleAreaOffsetTop,
    visibleNodeCount,
  };
}
