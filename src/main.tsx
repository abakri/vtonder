/** @module Containers */

import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";

import "./index.css";
import App from "./App";
import { store } from "./app/store";

const container = document.getElementById("root");

if (!container) throw new Error("Could not find root element with id 'root'");

const root = createRoot(container);

// Extend the Window interface in the global namespace
// Taken from https://stackoverflow.com/questions/56457935/typescript-error-property-x-does-not-exist-on-type-window
declare global {
    interface Window {
        store: Store;
        Cypress: never;
    }
}

// If we are running Cypress tests, set the store equal to the window.store so it's accessible
if (window.Cypress) {
    window.store = store;
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
