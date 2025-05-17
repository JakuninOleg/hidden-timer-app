let timeoutId = null;

self.onmessage = function (e) {
  const { command, delay } = e.data || {};
  if (command === 'start' && typeof delay === 'number') {
    timeoutId = setTimeout(() => {
      self.postMessage('timeout');
      timeoutId = null;
    }, delay);
  } else if (command === 'stop' && timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};