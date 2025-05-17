let timeoutId = null;

self.onmessage = function (e) {
  try {
    const { command, delay } = e.data || {};
    console.log('Worker received:', { command, delay });

    if (command === 'start' && typeof delay === 'number') {
      if (timeoutId) {
        console.log('Clearing existing timeout');
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        console.log('Timeout triggered');
        self.postMessage('timeout');
        timeoutId = null;
      }, delay);
    } else if (command === 'stop') {
      if (timeoutId) {
        console.log('Stopping timeout');
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      self.postMessage('stopped');
    } else {
      console.warn('Invalid command or delay:', command, delay);
    }
  } catch (error) {
    console.error('Error in worker:', error);
  }
};

self.onerror = function (error) {
  console.error('Worker global error:', error);
};