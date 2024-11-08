import "./index.css";
import "./styles/output.css";
console.log(
    '👋 This message is being logged by "setup_renderer.js", included via webpack'
  );


  // renderer.ts
const form = document.getElementById('setup-form') as HTMLFormElement;
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const STORE_EMAIL = (document.getElementById('storeEmail') as HTMLInputElement).value;
  const ADD_SERVER_HTTP = (document.getElementById('addServerHttp') as HTMLInputElement).value;

  // Send the data to the main process
  window.ipc.saveEnvVariables({ STORE_EMAIL, ADD_SERVER_HTTP });
});