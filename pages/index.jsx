"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
import Image from 'next/image'
import salesImage from "public/salesImage.jpg";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 

  return (
    <main className="flex min-h-screen flex-col items-center navbar-size">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<IndexPage />}
    </main>
  );
}

function IndexPage() {
  {
    return (
      <main>
        <Image
          src={salesImage}
          alt="Picture of Watch banner"
        />
      </main>
    );
  }
}

export default LoadPage;
