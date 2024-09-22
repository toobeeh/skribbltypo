import App from './Popup.svelte';

const app = new App({
  target: document.getElementById('app') ?? document,
});

export default app;
