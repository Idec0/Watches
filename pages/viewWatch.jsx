"use client";

import 'styles/globals.css';
import React, { useEffect, useState } from "react";
import Navbar from "components/base.jsx";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  return (
    <main className="flex min-h-screen flex-col p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      <ViewWatchPage />
    </main>
  );
}

function ViewWatchPage() {
  const [img, setImg] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [dropdown1, setDropdown1] = useState("V");
  const [dropdown2, setDropdown2] = useState("V");
  const [dropdown3, setDropdown3] = useState("V");
  const [goToBasketElement, setGoToBasketElement] = useState(null);
  const [watchDetails, setGetWatchDetails] = useState([]);
  let variable;

  useEffect(() => {

    if (typeof window !== "undefined") {
      const search = window.location.search;
      variable = new URLSearchParams(search).get("watch");
    }

    if (variable) {
      var imgs = variable.split(",");
      setImg(imgs);

    }
    GetImgs23(imgs);
    setGoToBasketElement("none");

    getWatchDetails();

  }, [variable]);

  const getWatchDetails = async() => {
    // get watch details
    try {
      // add new user to database
      var watch = {getWatchDetails: "True", product_name: img[2]} // Mens Admiral Watch 1513907
      const queryParams = new URLSearchParams(watch).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);

      setGetWatchDetails(result);
      console.log(watchDetails);
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const GetImgs23 = async (imgs) => {
    // get img 2 & 3
    try {
      var watch = {getImages: "True", product_name: imgs[2]}
      const queryParams = new URLSearchParams(watch).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result.imgs[0]);
      console.log(result);
      setImgs(result.imgs[0]);
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const AddToBasket = (watchPos) => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      let basketList = [];
      const storedBasket = localStorage.getItem("Basket");

      basketList = JSON.parse(storedBasket) || [];

      if (!basketList.some((subarray) => subarray.includes(watchPos[2]))) {
        basketList.push(watchPos);
      }

      localStorage.setItem("Basket", JSON.stringify(basketList));
      console.log(localStorage.getItem("Basket"));
    }
    var element = document.getElementById("goTobasket-container");    
    element.style.display = "flex";
    setGoToBasketElement(element.style.display);
  };

  const continueShopping = () => {
    var element = document.getElementById("goTobasket-container");    
    element.style.display = "none";
    setGoToBasketElement(element.style.display);
  }

  const viewWatches = () => {
    window.location.href ="/watches";
  }

  const gotToBasket = () => {
    window.location.href ="/basket";
  }

  const changeImg = (img) => {
    var imgElement = document.getElementById(`mainImg`);
    imgElement.src = img;
  }

  const generalDropDown = () => {
    var element = document.getElementsByClassName("generalDropdown");
    if(dropdown1 === "V"){
      setDropdown1("Λ");
      element[0].style.display = 'flex';
    }else{
      setDropdown1("V");
      element[0].style.display = 'none';
    }
    
  }

  const strapDropDown = () => {
    var element = document.getElementsByClassName("strapDropdown");
    if(dropdown2 === "V"){
      setDropdown2("Λ");
      element[0].style.display = 'flex';
    }else{
      setDropdown2("V");
      element[0].style.display = 'none';
    }
  }

  const movementDropDown = () => {
    var element = document.getElementsByClassName("movementDropdown");
    if(dropdown3 === "V"){
      setDropdown3("Λ");
      element[0].style.display = 'flex';
    }else{
      setDropdown3("V");
      element[0].style.display = 'none';
    }
  }
  
  return (
    <main>
      <div id="goTobasket-container" className='goTobasket-container'>
        <div className='goTobasket'>
          <p>Item added to your basket</p>
          <button onClick={() => gotToBasket()}>Go To Basket</button>
          <p onClick={() => continueShopping()}><u onClick={() => viewWatches()} style={{cursor: 'pointer'}}>Continue Shopping</u></p>
        </div>
      </div>
      
      {goToBasketElement === "none" && (        
        <div className='imageSlideAndWatchContainer'>
          <div className='imageSlide'>
            <img className="displayWatch" onClick={() => changeImg(img[4])} src={img[4]} alt="Watch" style={{ width: '90%', height: '30%', cursor: 'pointer' }} />
            <img className="displayWatch" onClick={() => changeImg(imgs.image_url_2)} src={imgs.image_url_2} alt="Watch" style={{ width: '90%', height: '30%', cursor: 'pointer' }} />
            <img className="displayWatch" onClick={() => changeImg(imgs.image_url_3)} src={imgs.image_url_3} alt="Watch" style={{ width: '90%', height: '30%', cursor: 'pointer' }} />
          </div>

          <img className="displayWatch" src={img[4]} style={{height: '680px', width: '680px'}} alt="Watch" id="mainImg" />

          <div className="displayWatchInfo">
            <h1>
              <u>
                <b style={{textTransform: 'capitalize'}}>
                  {img ? img[1] : "N/A"}{" "}
                </b>
              </u>
            </h1>
            <p>{img[2]}</p>
            <p>£{img[3]}</p>
            <button style={{ color: "black" }} onClick={() => AddToBasket(img)}>
              Add To Basket
            </button>

            <div className='dropDownStyle' onClick={() => generalDropDown()}>
              <p className='dropDownStyleCat'>General</p>
              <p>{dropdown1}</p>
            </div>
            <div className='generalDropdown'>
              <div style={{fontWeight: 'bold', padding: '10px 20px'}}>
                <p>Watches Code</p>
                <p>Brand</p>
                <p>Watch Face Diameter</p>
                <p>Chronograph</p>
                <p>Alarm</p>
                <p>Tachymeter</p>
                <p>Case Material</p>
                <p>Warranty</p>
              </div>
              <div style={{padding: '10px 20px'}}>
              <p>Watches Code</p>
                <p>Brand</p>
                <p>Watch Face Diameter</p>
                <p>Chronograph</p>
                <p>Alarm</p>
                <p>Tachymeter</p>
                <p>Case Material</p>
                <p>Warranty</p>
              </div>              
            </div>
            <div className='dropDownStyle' onClick={() => strapDropDown()}>
              <p className='dropDownStyleCat'>STRAP</p>
              <p>{dropdown2}</p>
            </div>
            <div className='strapDropdown'>
              <div style={{fontWeight: 'bold', padding: '10px 20px'}}>
                <p>Strap Type</p>
                <p>Strap Colour</p>
              </div>
              <div style={{padding: '10px 20px'}}>
                <p>Strap Type</p>
                <p>Strap Colour</p>
              </div>
            </div>
            <div className='dropDownStyle' onClick={() => movementDropDown()}>
              <p className='dropDownStyleCat'>MOVEMENT</p>
              <p>{dropdown3}</p>     
            </div>
            <div className='movementDropdown'>
              <div style={{fontWeight: 'bold', padding: '10px 20px'}}>
                <p>Watch Movement</p>                
              </div>
              <div style={{padding: '10px 20px'}}>
                <p>Watch Movement</p>                
              </div>
            </div>         
          </div>
        </div>        
      )}
    </main>
  );
}

export default LoadPage;
