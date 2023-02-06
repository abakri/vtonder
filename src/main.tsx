/** @module Containers */

import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from 'react-query'

import {
  BrowserRouter,
  createBrowserRouter,
} from "react-router-dom";

import "./index.css";
import { Login } from "./containers/Login/Login";
import { Sessions } from "./containers/Sessions/Sessions";
import { AppController } from "./components";
import { ProfileForm } from "./components/ProfileForm/ProfileForm";
import App from "./App";

const container = document.getElementById("root");

if (!container) throw new Error("Could not find root element with id 'root'");

const root = createRoot(container);

// react query
const queryClient = new QueryClient()

// create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard/",
    element: <Sessions />
  },
  {
    path: "/:sessionId/swipe/",
    element: <AppController />
  },
  {
    path: "/:sessionId/form/",
    element: <ProfileForm />
  }

]);


root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
