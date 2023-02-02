/** @module Containers */
import React from "react";

import { Header } from "./components";
import { Phone } from "./containers";


function App(): JSX.Element {
  return (
    <>
      <Header />
      {/* height should be the screen minus the header */}
      <div className="flex justify-center items-center w-screen h-[calc(100vh-64px)] sm:h-[calc(100vh-56px)] bg-purple-200">
        <Phone/>
      </div>
    </>
  );
}

export default App;