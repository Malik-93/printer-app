import "./index.css";
import "./styles/output.css";
console.log(
    '👋 This message is being logged by "setup_renderer.js", included via webpack'
  );


  // renderer.ts
const form = document.getElementById('setup-form') as HTMLFormElement;
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const apiUrl = (document.getElementById('storeEmail') as HTMLInputElement).value;
  const secretKey = (document.getElementById('secretKey') as HTMLInputElement).value;

  // Send the data to the main process
  window.ipc.saveEnvVariables({ apiUrl, secretKey });
});