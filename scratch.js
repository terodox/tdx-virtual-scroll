import React, {
  memo,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";

// Generic hook for detecting scroll:
const useScrollAware = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef();
  const animationFrame = useRef();

  const onScroll = useCallback(e => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    animationFrame.current = requestAnimationFrame(() => {
      setScrollTop(e.target.scrollTop);
    });
  }, []);

  useEffect(() => {
    const scrollContainer = ref.current;

    setScrollTop(scrollContainer.scrollTop);
    scrollContainer.addEventListener("scroll", onScroll);
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, []);

  return [scrollTop, ref];
};

// VirtualScroll component
const VirtualScroll = ({
  Item,
  itemCount,
  height,
  getChildHeight,
  renderAhead = 20
}) => {
  const childPositions = useMemo(() => {
    let results = [0];
    for (let i = 1; i < itemCount; i++) {
      results.push(results[i - 1] + getChildHeight(i - 1));
    }
    return results;
  }, [getChildHeight, itemCount]);

  const [scrollTop, ref] = useScrollAware();
  const totalHeight =
    childPositions[itemCount - 1] + getChildHeight(itemCount - 1);

  const firstVisibleNode = useMemo(
    () => findStartNode(scrollTop, childPositions, itemCount),
    [scrollTop, childPositions, itemCount]
  );

  const startNode = Math.max(0, firstVisibleNode - renderAhead);

  const lastVisibleNode = useMemo(
    () => findEndNode(childPositions, firstVisibleNode, itemCount, height),
    [childPositions, firstVisibleNode, itemCount, height]
  );
  const endNode = Math.min(itemCount - 1, lastVisibleNode + renderAhead);
  const visibleNodeCount = endNode - startNode + 1;
  const offsetY = childPositions[startNode];
  // console.log(height, scrollTop, startNode, endNode);
  const visibleChildren = useMemo(
    () =>
      new Array(visibleNodeCount)
        .fill(null)
        .map((_, index) => (
          <Item key={index + startNode} index={index + startNode} />
        )),
    [startNode, visibleNodeCount, Item]
  );

  return (
    <div style={{ height, overflow: "auto" }} ref={ref}>
      <div
        className="viewport"
        style={{
          overflow: "hidden",
          willChange: "transform",
          height: totalHeight,
          position: "relative"
        }}
      >
        <div
          style={{
            willChange: "transform",
            transform: `translateY(${offsetY}px)`
          }}
        >
          {visibleChildren}
        </div>
      </div>
    </div>
  );
};

function findStartNode(scrollTop, nodePositions, itemCount) {
  let startRange = 0;
  let endRange = itemCount - 1;
  while (endRange !== startRange) {
    // console.log(startRange, endRange);
    const middle = Math.floor((endRange - startRange) / 2 + startRange);

    if (
      nodePositions[middle] <= scrollTop &&
      nodePositions[middle + 1] > scrollTop
    ) {
      // console.log("middle", middle);
      return middle;
    }

    if (middle === startRange) {
      // edge case - start and end range are consecutive
      // console.log("endRange", endRange);
      return endRange;
    } else {
      if (nodePositions[middle] <= scrollTop) {
        startRange = middle;
      } else {
        endRange = middle;
      }
    }
  }
  return itemCount;
}

function findEndNode(nodePositions, startNode, itemCount, height) {
  let endNode;
  for (endNode = startNode; endNode < itemCount; endNode++) {
    // console.log(nodePositions[endNode], nodePositions[startNode]);
    if (nodePositions[endNode] > nodePositions[startNode] + height) {
      // console.log(endNode);
      return endNode;
    }
  }
  return endNode;
}

export default memo(VirtualScroll);
