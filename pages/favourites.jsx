"use client";

import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between navbar-size">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<FavouritesPage />}
    </main>
  );
}

function FavouritesPage() {
}

export default LoadPage;