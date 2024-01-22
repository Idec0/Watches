"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<AdminPage />}
    </main>
  );
}

function AdminPage() {
  const [title, setTitle] = useState("Admin Panel")

  const setDisplayTitle = (text) => {
    setTitle(text);
  }

  const addNewWatch = async () => {
    var brand_name = document.getElementById("brand_name").value
    var image_url = document.getElementById("image_url").value
    var product_name = document.getElementById("product_name").value
    var price = document.getElementById("price").value

    try {
        // add new user to database
        var watch = {brand_name: brand_name, image_url: image_url, product_name: product_name, price: price}
        const queryParams = new URLSearchParams(watch).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

      }catch (error) {
        console.error('Error fetching data:', error);
      }
  }

  return (
    <main style={{width: '100%'}}>
      <div className='admin-panel-grid-container'>
        <div className='sidebar'>
          <div className='admin-panel-container'>
            <button onClick={() => setDisplayTitle("Edit Watches")}>Edit Watches</button>
            <button onClick={() => setDisplayTitle("Add a New Watch")}>Add a New Watch</button>
            <button onClick={() => setDisplayTitle("Edit Discounts")}>Edit Discounts</button>
          </div>
        </div>
        <div className='item1'>
          <div className='admin-panel-details'>
            <h1><u>{ title }</u></h1>
            {title === "Edit Watches" && (
              <p></p>
            )}
            {title === "Add a New Watch" && (
              <>
                <input placeholder='Brand' id="brand_name" />
                <input placeholder='Image Url'id="image_url" />
                <input placeholder='Product Name' id="product_name" />
                <input placeholder='Price' id="price" />
                <button onClick={() => addNewWatch()}>Add New Watch</button>
              </>
            )}
            {title === "Edit Discounts" && (
              <p></p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoadPage;
