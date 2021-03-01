export function softBinarySearch(value: number, list: number[]) {
  let first = 0; //left endpoint
  let last = list.length - 1; //right endpoint
  let position = -1;
  let found = false;
  let middle;

  while (found === false && first <= last) {
    middle = Math.floor((first + last) / 2);
    if (list[middle] >= value || list[middle + 1] <= value) {
      found = true;
      position = middle;
    } else if (list[middle] > value) {
      //if in lower half
      last = middle - 1;
    } else {
      //in in upper half
      first = middle + 1;
    }
  }
  return position;
}
