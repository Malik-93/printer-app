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

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack'
);

// const set_title_btn = document.getElementById("set_title");
// set_title_btn.addEventListener("click", () => {
//   window.gmd_api.setTitle("Hello from renderer process!");
// });

window.gmd_api.onPrinters((printers: Electron.PrinterInfo[]) => {
  console.log("Printers:", printers);
  const printers_container = document.getElementById("printers_container");
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const header_row = document.createElement("tr");
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
    header_row.appendChild(th);
  });
  thead.appendChild(header_row);
  table.appendChild(thead);

  printers.forEach((printer) => {
    const row = document.createElement("tr");
    const columns = [
      printer.name,
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
      row.appendChild(td);
    });
    tbody.appendChild(row);
    table.appendChild(tbody);
  });

  printers_container.appendChild(table);
});
