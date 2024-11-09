import "./index.css";
import "./styles/output.css";

class SetupRenderer {
  private form: HTMLFormElement | null;

  constructor() {
    console.log(
      '👋 This message is being logged by "setup_renderer.js", included via webpack'
    );

    // Initialize form and event listener
    this.form = document.getElementById("setup-form") as HTMLFormElement;
    this.initializeFormSubmitListener();
  }

  private initializeFormSubmitListener() {
    this.form?.addEventListener("submit", (event) => this.handleSubmit(event));
  }

  private handleSubmit(event: Event) {
    event.preventDefault();

    const STORE_EMAIL = (document.getElementById("storeEmail") as HTMLInputElement).value;
    const ADD_SERVER_HTTP = (document.getElementById("addServerHttp") as HTMLInputElement).value;

    // Send the data to the main process
    window.ipc.saveEnvVariables({ STORE_EMAIL, ADD_SERVER_HTTP });
  }
}

// Initialize the SetupRenderer class on load
new SetupRenderer();
