/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import "./styles/output.css";
console.log(
  '👋 This message is being logged by "renderer.js", included via webpack'
);

// const set_title_btn = document.getElementById("set_title");
// set_title_btn.addEventListener("click", () => {
//   window.ipc.setTitle("Hello from renderer process!");
// });

window.ipc.onPrinters((printers: Electron.PrinterInfo[]) => {
  console.log("Printers:", printers);
  const printers_container = document.getElementById("printers_container");
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const header_row = document.createElement("tr");
  header_row.className = "hover:bg-gray-50";
  table.className =
    "min-w-full border border-gray-300 divide-y divide-gray-200";
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
    header_row.appendChild(th);
  });
  thead.appendChild(header_row);
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
      td.textContent = column.toString();
      td.className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500";
      row.appendChild(td);
    });
    tbody.appendChild(row);
    table.appendChild(tbody);
  });

  printers_container.appendChild(table);
});

window.ipc.onLogMessage((logMsg: string) => {
  const logContainer = document.getElementById("logContainer");
  const ul = document.getElementById("logs_list");
  const li = document.createElement("li");
  li.className = "m-2";
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  li.textContent = `${hours}:${minutes}:${seconds} - ${logMsg}`;
  ul.appendChild(li);
  logContainer.appendChild(ul);
});

window.ipc.onNgrokUrl((url: string) => {
  const ngrokAncher = document.getElementById("ngrok_url") as HTMLAnchorElement;
  ngrokAncher.textContent = url;
  ngrokAncher.href = url;
  ngrokAncher.target = "_blank";
  ngrokAncher.style.color = "blue";
});
