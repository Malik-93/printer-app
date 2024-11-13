import { cancelIcon, saveIcon } from "./icons/svgs";
import "./index.css";
import "./styles/output.css";

class SetupRenderer {
  constructor() {
    // Initialize form and event listener
    this.addNewFieldClick();
    this.initializeIpcListeners();
  }

  private initializeIpcListeners() {
    window.ipc.showSystemValues((sysVals: { [key: string]: string }) => {
      this.displaySystemValues(sysVals);
    });
  }

  private displaySystemValues(sysVals: { [key: string]: string }) {
    console.log("System Values:", sysVals);
    Object.keys(sysVals).forEach((key) =>
      this.createKeyValueElement(key, sysVals[key])
    );
  }

  private createKeyValueElement(key = "", value = "") {
    const container = document.getElementById("new-fields-container");
    // Create new field container
    const newFieldDiv = document.createElement("div");
    newFieldDiv.classList.add("mb-4", "flex", "gap-4", "items-center");
    // Create key input for new field (this will be the field's key)
    const keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.placeholder = "Enter key";
    keyInput.classList.add(
      "flex-1",
      "px-4",
      "py-2",
      "border",
      "border-gray-300",
      "rounded-lg",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-500",
      "focus:border-blue-500"
    );
    keyInput.value = key;
    // Create value input for new field (this will be the field's value)
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.placeholder = "Enter value";
    valueInput.classList.add(
      "flex-1",
      "px-4",
      "py-2",
      "border",
      "border-gray-300",
      "rounded-lg",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-500",
      "focus:border-blue-500"
    );
    valueInput.value = value;
    // Create Save button with icon
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.classList.add(
      "py-2",
      "text-green-500",
      "hover:text-green-700",
      "focus:outline-none"
    );
    saveButton.innerHTML = saveIcon;
    saveButton.addEventListener("click", function () {
      let keyValuePairs: { [key: string]: string } = {}; // Object to store key-value pairs
      const key = keyInput.value.trim();
      const value = valueInput.value.trim();
      if (key && value) {
        console.log("Key-Value Pairs:", keyValuePairs);
        keyValuePairs[key] = value;
        window.ipc.saveEnvVariables(keyValuePairs);
        alert(`Saved: ${key} = ${value}`);
      } else {
        alert("Both key and value are required to save.");
      }
    });

    // Create Cancel button with icon
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.classList.add(
      "py-2",
      "text-red-500",
      "hover:text-red-700",
      "focus:outline-none"
    );
    cancelButton.innerHTML = cancelIcon;
    cancelButton.addEventListener("click", function () {
      newFieldDiv.remove(); // Remove the new field container
    });

    // Append key input, value input, save button, and cancel button to the field container
    newFieldDiv.appendChild(keyInput);
    newFieldDiv.appendChild(valueInput);
    newFieldDiv.appendChild(saveButton);
    newFieldDiv.appendChild(cancelButton);

    // Append new field container to the form
    container.appendChild(newFieldDiv);
  }

  private addNewFieldClick() {
    // Function to add a new input field
    document
      .getElementById("add-new-field")
      .addEventListener("click", () => this.createKeyValueElement());
  }
}

// Initialize the SetupRenderer class on load
new SetupRenderer();
