"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 
  return (
    <main className="flex min-h-screen flex-col items-center navbar-size">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<AdminPage />}
    </main>
  );
}

function AdminPage() {
  const [title, setTitle] = useState("Admin Panel");
  const [discounts, setDiscounts] = useState([]);
  const [watches, setWatches] = useState([]);

  const setDisplayTitle = async (text) => {
    setTitle(text);
    if(text === "Edit Discounts"){
      try {
        // get discounts
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent("get_discounts")}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setDiscounts(result);
      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(text === "Edit Watches"){
      try {
        // get watches
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent("Brands")}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        var brands = result.discounts;
        setWatches(brands);

      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }

  const addNewWatch = async () => {
    var brand_name = document.getElementById("brand_name").value
    var image_url = document.getElementById("image_url").value
    var image_url2 = document.getElementById("image_url2").value
    var image_url3 = document.getElementById("image_url3").value
    var product_name = document.getElementById("product_name").value
    var price = document.getElementById("price").value

    try {
      // add new watch to database
      var watch = {brand_name: brand_name, image_url: image_url, image_url2: image_url2, image_url3: image_url3, product_name: product_name, price: price}
      const queryParams = new URLSearchParams(watch).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      window.location.reload();
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const editDiscount = async (discount) => {
    var discountElement = document.getElementById(discount.discount_code);
    var discountAmountElement = document.getElementById(`${discount.discount_code} amount`);
    var discountDateElement = document.getElementById(`${discount.discount_code} date`);
    var discountDeleteElement = document.getElementById(`${discount.discount_code} delete`);

    let elements = [];
    elements.push(discountAmountElement);
    elements.push(discountDateElement);

    let discountType = []

    if (discountElement.innerHTML === "Save") {
      discountElement.innerHTML = "Edit";      
      discountDeleteElement.style.display = 'none';
      
      var discountAmountElement = document.getElementById(`${discount.discount_code} amount`);

      discountType.push(discountAmountElement.children[0].value);
      discountType.push(discountDateElement.children[0].value);


      for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = discountType[i];
      }

      // save changes
      try {
        var discount = {save_discount_changes: "True", discount_code: discount.discount_code, discount_amount: discountType[0], end_date: discountType[1]}
        const queryParams = new URLSearchParams(discount).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }catch (error) {
        console.error('Error fetching data:', error);
      }

      setDisplayTitle("Edit Discounts");

    }else{
      discountElement.innerHTML = "Save";
      discountDeleteElement.style.display = 'block';

      discountType.push(discount.discount_amount);
      discountType.push(new Date(discount.end_date).toISOString().split('T')[0]);

      for (let i = 0; i < elements.length; i++) {
        var inputElement = document.createElement("input");
    
        inputElement.type = "text";
        inputElement.value = discountType[i];
        inputElement.id = "yourInputId";
        //inputElement.style.width = '40px';
        inputElement.classList.add('admin-panel-details-table-input');
        
    
        elements[i].innerHTML = "";
        elements[i].appendChild(inputElement);
      }
    }
  }

  const addNewDiscount = async () => {
    var discount_code = document.getElementById("new_discount_code").value
    var discount_amount = document.getElementById("new_discount_amount").value
    var end_date = document.getElementById("new_discount_end_date").value

    try {
      // add new user to database
      var discount = {add_discount: "True", discount_code: discount_code, discount_amount: discount_amount, end_date: end_date}
      const queryParams = new URLSearchParams(discount).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      window.location.reload();

    }catch (error) {
      console.error('Error fetching data:', error);
    }    
  }

  const deleteDiscount = async (discount) => {
    try {
      // add new user to database
      const discount_to_delete = { delete_discount: discount.discount_code };
      const queryParams = new URLSearchParams(discount_to_delete).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    }catch (error) {
      console.error('Error fetching data:', error);
    }
    setDisplayTitle("Edit Discounts");
  }

  const editWatch = async (watch) => {
    var discountElement = document.getElementById(watch.product_name);
    var discountProductElement = document.getElementById(`${watch.product_name} product`);
    var discountBrandElement = document.getElementById(`${watch.product_name} brand`);
    var discountImgElement = document.getElementById(`${watch.product_name} image_url`);
    var discountImg2Element = document.getElementById(`${watch.product_name} image_url2`);
    var discountImg3Element = document.getElementById(`${watch.product_name} image_url3`);
    var discountPriceElement = document.getElementById(`${watch.product_name} price`);
    var discountDeleteElement = document.getElementById(`${watch.product_name} delete`);

    let elements = [];
    elements.push(discountProductElement);
    elements.push(discountBrandElement);
    elements.push(discountImgElement);
    elements.push(discountImg2Element);
    elements.push(discountImg3Element);
    elements.push(discountPriceElement);

    let discountType = []

    if (discountElement.innerHTML === "Save") {
      discountElement.innerHTML = "Edit";      
      discountDeleteElement.style.display = 'none';

      discountType.push(discountProductElement.children[0].value);
      discountType.push(discountBrandElement.children[0].value);
      discountType.push("...");
      discountType.push("...");
      discountType.push("...");
      discountType.push(discountPriceElement.children[0].value);
      discountType.push(discountImgElement.children[0].value);
      discountType.push(discountImg2Element.children[0].value);
      discountType.push(discountImg3Element.children[0].value);


      for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = discountType[i];
      }

      elements[2].title = discountType[6];
      elements[3].title = discountType[7];
      elements[4].title = discountType[8];

      // save changes
      try {
        var discount = {save_watch_changes: "True", product_name: discountType[0], brand: discountType[1], image_url: discountType[6], image_url_2: discountType[7], image_url_3: discountType[8], price: discountType[5]}
        const queryParams = new URLSearchParams(discount).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }catch (error) {
        console.error('Error fetching data:', error);
      }

      setDisplayTitle("Edit Watches");

    }else{
      discountElement.innerHTML = "Save";
      discountDeleteElement.style.display = 'block';
      discountType.push(watch.product_name);
      discountType.push(watch.brand_name);
      discountType.push(watch.image_url);
      discountType.push(watch.image_url_2);
      discountType.push(watch.image_url_3);
      discountType.push(watch.price);

      for (let i = 0; i < elements.length; i++) {
        var inputElement = document.createElement("input");
    
        inputElement.type = "text";
        inputElement.value = discountType[i];
        inputElement.id = "yourInputId";
        //inputElement.style.width = '150px';
        inputElement.classList.add('admin-panel-details-table-watches-input');
        elements[i].innerHTML = "";
        elements[i].appendChild(inputElement);
      }
    }
  }

  return (
    <main style={{width: '100%'}}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <div className='admin-panel-grid-container'>
        <div className='sidebar'>
          <div className='admin-panel-container'>
            <button onClick={() => setDisplayTitle("Edit Watches")}>Edit Watches</button>
            <button onClick={() => setDisplayTitle("Add a New Watch")}>Add a New Watch</button>
            <button onClick={() => setDisplayTitle("Edit Discounts")}>Edit Discounts</button>
            <button onClick={() => setDisplayTitle("Add a New Discounts")}>Add a New Discounts</button>
          </div>
        </div>
        <div className='item1'>
          <div className='admin-panel-details'>
            <h1><u>{ title }</u></h1>
            {title === "Edit Watches" && (
              <table style={{margin: 'auto 20px'}}>
                <tr>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Main Image Url</th>
                  <th>Image Url 2</th>
                  <th>Image Url 3</th>
                  <th>Price (£)</th>
                </tr>
                {watches.map((watch) => (
                  <tr key={watch.product_name}>
                    <td id={`${watch.product_name} product`}>{watch.product_name}</td>
                    <td id={`${watch.product_name} brand`}>{watch.brand_name}</td>
                    <td id={`${watch.product_name} image_url`} title={watch.image_url}>...</td>
                    <td id={`${watch.product_name} image_url2`} title={watch.image_url_2}>...</td>
                    <td id={`${watch.product_name} image_url3`} title={watch.image_url_3}>...</td>
                    <td id={`${watch.product_name} price`}>{watch.price}</td>
                    <button className='admin-panel-details-button' onClick={() => editWatch(watch)} style={{ marginLeft: '10px'}} id={watch.product_name}>Edit</button>
                    <button className='admin-panel-details-button' onClick={() => deleteWatch(watch)} style={{ color: 'red', display: 'none', marginLeft: '10px'}} id={`${watch.product_name} delete`}>Delete</button>
                  </tr>
                ))}
              </table>
            )}
            {title === "Add a New Watch" && (
              <>
                <input className='admin-panel-details-text-input' placeholder='Brand' id="brand_name" />
                <input className='admin-panel-details-text-input' placeholder='Product Name' id="product_name" />
                <input className='admin-panel-details-text-input' placeholder='Main Image Url'id="image_url" />
                <input className='admin-panel-details-text-input' placeholder='Image Url 2'id="image_url2" />
                <input className='admin-panel-details-text-input' placeholder='Image Url 3'id="image_url3" />
                <input className='admin-panel-details-text-input' placeholder='Price' id="price" />
                <button className='admin-panel-details-text-input' onClick={() => addNewWatch()} style={{backgroundColor: '#13204b'}}>Add New Watch</button>
              </>
            )}
            {title === "Edit Discounts" && (
              <table style={{margin: 'auto'}}>
                <tr>
                  <th>Discount Code</th>
                  <th>Discount Amount</th>
                  <th>End Date</th>
                </tr>
                {discounts.map((discount) => (
                  <tr key={discount.discount_code}>
                    <td>{discount.discount_code}</td>
                    <td id={`${discount.discount_code} amount`}>{discount.discount_amount}</td>
                    <td id={`${discount.discount_code} date`}>{new Date(discount.end_date).toISOString().split('T')[0]}</td>
                    <button className='admin-panel-details-button' onClick={() => editDiscount(discount)} style={{ marginLeft: '10px'}} id={discount.discount_code}>Edit</button>
                    <button className='admin-panel-details-button' onClick={() => deleteDiscount(discount)} style={{ color: 'red', display: 'none', marginLeft: '10px'}} id={`${discount.discount_code} delete`}>Delete</button>
                  </tr>
                ))}
              </table>
            )}
            {title === "Add a New Discounts" && (
              <>
                <input className='admin-panel-details-text-input' placeholder='Discount Code' id="new_discount_code" />
                <input className='admin-panel-details-text-input' placeholder='Discount Percentage Amount'id="new_discount_amount" />
                <input className='admin-panel-details-text-input' placeholder='End Date (YYYY-MM-DD)' id="new_discount_end_date" />
                <button className='admin-panel-details-text-input' onClick={() => addNewDiscount()} style={{backgroundColor: '#13204b'}}>Add New Discount</button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoadPage;
