let debounceTimer: NodeJS.Timeout;
export function debounce(functionToCall: () => void, debounceTimeInMs: number) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(functionToCall, debounceTimeInMs);
}
