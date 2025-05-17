<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isRunning = ref(false);
let worker = null;

const startTimer = () => {
  if (isRunning.value) return;
  isRunning.value = true;

  const delay = (Math.floor(Math.random() * 6) + 10) * 60 * 1000; // 10-15 минут

  worker = new Worker('/timerWorker.js');
  worker.postMessage({ command: 'start', delay });

  worker.onmessage = (e) => {
    if (e.data === 'timeout') {
      notify();
      isRunning.value = false;
      worker.terminate();
      worker = null;
    }
  };
};

const stopTimer = () => {
  if (worker) {
    worker.postMessage({ command: 'stop' });
    worker.terminate();
    worker = null;
  }
  isRunning.value = false;
};

const notify = () => {
  if (Notification.permission === 'granted') {
    new Notification('Таймер сработал!', {
      body: 'Прошло от 10 до 15 минут!',
      icon: '/icon-192.png',
    });
  }
};

onMounted(() => {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

onBeforeUnmount(() => {
  if (worker) {
    worker.terminate();
  }
});
</script>
