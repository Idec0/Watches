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
  const [bannerUrl, setBannerUrl] = useState("https://www.houseofwatches.co.uk/media/wysiwyg/1920x554_THB_Prospex_SPB381J1.jpg");

  useEffect(() => {
    GetBannerUrl();
  }, []); 

  const GetBannerUrl = async () => {
    try {      
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent("get_sales")}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // get valid banner
      for (const sale in result){
        const start_date = new Date(result[sale].sale_start_date);
        const end_date = new Date(result[sale].sale_end_date);
        start_date.setFullYear(currentDate.getFullYear());
        end_date.setFullYear(currentDate.getFullYear());
        if (currentDate >= start_date && currentDate <= end_date) {
          setBannerUrl(result[sale].sale_banner_url);
          return;
        } else {
          setBannerUrl("https://www.houseofwatches.co.uk/media/wysiwyg/1920x554_THB_Prospex_SPB381J1.jpg");
        }        
      }

    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  {
    return (
      <main>
        <img
          src={bannerUrl}
          alt="Picture of Watch banner"
        />
      </main>
    );
  }
}

export default LoadPage;
