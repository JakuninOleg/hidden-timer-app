let timeoutId = null;

self.onmessage = function (e) {
  const { command, delay } = e.data;
  if (command === 'start') {
    timeoutId = setTimeout(() => {
      self.postMessage('timeout');
    }, delay);
  } else if (command === 'stop') {
    clearTimeout(timeoutId);
  }
};
