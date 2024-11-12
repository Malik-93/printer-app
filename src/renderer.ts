import "./index.css";
import "./styles/output.css";

class RendererApp {
  constructor() {
    console.log(
      '👋 This message is being logged by "renderer.js", included via webpack'
    );

    // Event listeners for buttons
    this.initializeReloadAppButton();
    this.initializeScanPrintersButton();
    this.initializeSetupButton();
    // IPC event listeners
    this.initializeIpcListeners();
  }
  private initializeSetupButton() {
    document.getElementById("setup_btn").addEventListener("click", () => {
      window.ipc.setupWindow();
    });
  }
  private initializeReloadAppButton() {
    document.getElementById("reload_app_btn").addEventListener("click", () => {
      window.ipc.reloadApp();
    });
  }

  private initializeScanPrintersButton() {
    document
      .getElementById("scan_printers_btn")
      .addEventListener("click", () => {
        window.ipc.scanPrinters();
      });
  }

  private initializeIpcListeners() {
    window.ipc.onPrinters((printers: Electron.PrinterInfo[]) => {
      this.displayPrinters(printers);
    });

    window.ipc.onLogMessage((logMsg: string) => {
      this.displayLogMessage(logMsg);
    });

    window.ipc.onNgrokUrl((url: string) => {
      this.displayNgrokUrl(url);
    });

    window.ipc.showSystemValues((sysVals: { [key: string]: string }) => {
      this.displaySystemValues(sysVals);
    });
  }

  private displayPrinters(printers: Electron.PrinterInfo[]) {
    console.log("Printers:", printers);
    const printersContainer = document.getElementById("printers_container");
    printersContainer.innerHTML = "";
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const headerRow = document.createElement("tr");

    headerRow.className = "hover:bg-gray-50";
    table.className = "w-full border border-gray-300 divide-y divide-gray-200";
    thead.className = "bg-gray-100";
    tbody.className = "bg-white divide-y divide-gray-200";

    const headers = [
      "Name",
      "Description",
      "Status",
      "Device URI",
      "Device URI Supported",
    ];
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      th.scope = "col";
      th.className =
        "px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider";
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    printers.forEach((printer) => {
      const row = document.createElement("tr");
      const columns = [
        printer.displayName,
        printer.description,
        printer.status,
        // @ts-ignore
        printer?.options?.["device-uri"],
        // @ts-ignore
        printer?.options?.["printer-uri-supported"],
      ];
      columns.forEach((column) => {
        const td = document.createElement("td");
        td.textContent = column?.toString() || "";
        td.className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500";
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    printersContainer?.appendChild(table);
  }

  private displayLogMessage(logMsg: string) {
    const ul = document.getElementById("logs_list") as HTMLUListElement;
    const li = document.createElement("li");
    li.className =
      "px-4 py-5 bg-white shadow text-sm text-gray-800 m-2 min-w-full leading-loose";

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    li.textContent = `${hours}:${minutes}:${seconds} - ${logMsg}`;
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
  }

  private displayNgrokUrl(url: string) {
    const ngrokAnchor = document.getElementById(
      "ngrok_url"
    ) as HTMLAnchorElement;
    if (ngrokAnchor) {
      ngrokAnchor.textContent = url;
      ngrokAnchor.href = url;
      ngrokAnchor.target = "_blank";
      ngrokAnchor.style.color = "blue";
    }
  }

  private displaySystemValues(sysVals: { [key: string]: string }) {
    const storeEmail = document.getElementById("storeEmail");
    if (storeEmail && sysVals.STORE_EMAIL) {
      storeEmail.textContent = sysVals.STORE_EMAIL;
    }
  }
}

// Initialize the RendererApp class on load
new RendererApp();
