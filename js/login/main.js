import { initFirebaseLogin } from './auth.js';

window.addEventListener('DOMContentLoaded', onDomLoaded);

function onDomLoaded() {
  initFirebaseLogin();
}
