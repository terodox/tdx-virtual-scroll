export function calculateView({
  itemHeight,
  offsetTop,
  viewportHeight,
  viewportPadding,
}: {
  itemHeight: number;
  offsetTop: number;
  viewportHeight: number;
  viewportPadding: number;
}) {
  const lowestVisibleNodeIndex = Math.ceil(
    offsetTop / (itemHeight - viewportPadding)
  );

  let startNodeIndex = lowestVisibleNodeIndex - 5;
  if (startNodeIndex - 5 <= 0) {
    startNodeIndex = 0;
  }

  const visibleAreaOffsetTop = Math.ceil(startNodeIndex * itemHeight);
  const visibleNodeCount =
    Math.ceil(viewportHeight / itemHeight) - 2 * viewportPadding;

  return {
    startNodeIndex,
    visibleAreaOffsetTop,
    visibleNodeCount,
  };
}
