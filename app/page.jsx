"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
import salesImage from "app/salesImage.jpg";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<IndexPage />}
    </main>
  );
}

function IndexPage() {
  {
    console.log(salesImage);
    return (
      <main>
        <img
          src="https://www.houseofwatches.co.uk/media/wysiwyg/HoW-CM-2023-v2_01__1920x554.jpg"
          alt=""
        />
      </main>
    );
  }
}

export default LoadPage;
