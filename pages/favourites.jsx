"use client";

import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import heartImage from "public/heart.png";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between navbar-size">
        <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
        <FavPage />
      </main>
    </>
  );
}


const FavPage = () => {
  const router = useRouter();

  const [val, setVal] = useState("");
  const [reload, setReload] = useState(true);
  const [isRedArray, setIsRedArray] = useState([]);
  const [likedWatches, setLikedWatches] = useState([""]);
  const [filteredData, setFilteredData] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false); // fix infinite loop for fav page
  const [brands, setBrands] = useState(null);
  const [favBrands, setFavBrands] = useState([]);
  const [saleAmount, setSaleAmount] = useState(0);

  const isClient = typeof window !== 'undefined'; // Check if window is defined

  // code to pass a varibale through links

  // Access the search part of the URL, e.g., '?param1,param2,param3'
  const search = isClient ? window.location.search : '';

  // Extract the variable from the search
  const variable = isClient ? new URLSearchParams(search).get('imgs') : '';

  // Parse the variable back into an array
  let imgs = variable ? variable.split(',') : [];

  if(imgs.length > 1 && imgs[0] === ""){
    imgs = [];
  }
  // end of code to pass a varibale through links

  // Wrap code that relies on client-side features in a check for window

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIsRedArray = localStorage.getItem("isRedArray");
      setIsRedArray(storedIsRedArray ? JSON.parse(storedIsRedArray) : []);

      SetLikedWatches1();

      GetBannerUrl();     
      setFavBrands([]);
    }
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
          setSaleAmount(result[sale].sale_amount);
          return; 
        } else {
          setSaleAmount(0);
        }        
      }

    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const SetLikedWatches1 = async () => {
    let storedLikedWatches = localStorage.getItem("likedWatches");
    if(storedLikedWatches === null){
      localStorage.setItem("likedWatches", "[]");
      storedLikedWatches = localStorage.getItem("likedWatches");
    }
    if(storedLikedWatches === ""){
      storedLikedWatches.push("");
    }
    await new Promise(resolve => setTimeout(resolve, 10));
    setLikedWatches(JSON.parse(storedLikedWatches));
  }
  
  const fetchBrandsData = async () => {
    try {
      const response = await fetch('/api/data?discount_code=Brands');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      // Store the result in localStorage
      setBrands(result.discounts);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchBrandsData();
  }, []);

  // keep just incase database gets deleted
  const brandsBackup = {
    boss: [
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/34b4a13777517e40e5b794fdc3ecddeb/2/3/23-29-421_grey.jpg",
        "Mens Admiral Watch 1513907",
        329,
      ],
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/34b4a13777517e40e5b794fdc3ecddeb/2/3/23-29-457_01_drop-shadow.jpg",
        "Mens Ace Carnation Gold IP Watch 1514012",
        299,
      ],
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/34b4a13777517e40e5b794fdc3ecddeb/2/3/23-29-393_grey.jpg",
        "HERO WATCH 1513758",
        399,
      ],
    ],
    casio: [
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/34b4a13777517e40e5b794fdc3ecddeb/2/1/21-42-671_01_1.jpg",
        "G-Shock Full Metal 2100 Series SIlver Smartwatch GM-B2100D-1AER",
        449,
      ],
    ],
    citizen: [
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/34b4a13777517e40e5b794fdc3ecddeb/2/2/22-39-592_grey.jpg",
        "Ladies Axiom Rose Gold Plated Black Dial Leather Strap Watch GA1058-16E",
        199,
      ],
    ],
    fossil: [
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/34b4a13777517e40e5b794fdc3ecddeb/f/s/fs5380_grey.jpg",
        "Mens Neutra Chronograph Watch FS5380",
        159,
      ],
    ],
    oris: [
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/dcbf10923bf8373a37990fd538c120d9/2/4/24-56-127_grey.jpg",
        "Mens Divers Sixty-Five Brown Leather Strap Watch 733 7720 4055-07 5 21 02",
        1900,
      ],
    ],
    tissot: [
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/dcbf10923bf8373a37990fd538c120d9/2/3/23-52-420_grey.jpg",
        "PRC 200 Stainless Steel Blue Dial Chronograph Watch T114.417.11.047.00",
        480,
      ],
    ],    
  };
  
  /* list of every watch */
  let imgList = [];
  let data = [];
  let imagePositionMap = {};
  let watchListIndex = 0;
  
  // used for dictionary already defined (brandsBackup) -- keep just incase database gets deleted
  if(brands === null){
    for (const brand in brandsBackup) {
      data.push(brand);
      brandsBackup[brand].forEach((imageURL) => {
        imgList.push(imageURL[0]);
        imagePositionMap[imageURL[0]] = [
          watchListIndex,
          brand,
          imageURL[1],
          imageURL[2],
        ];
        watchListIndex++;
      });
    }
  }
  
  const loadBrands = () => {
    if (brands && typeof brands === 'object'  && Object.keys(brands).length > 0) {
  
      // Sort the array by brand_name and product name
      const sortedProductName = brands.sort((a, b) => a.product_name.localeCompare(b.product_name));
      const sortedBrands = sortedProductName.sort((a, b) => a.brand_name.localeCompare(b.brand_name));
  
      const brandsArray =  sortedBrands ? Object.entries(sortedBrands) : [];
  
      for (const [brandKey, brandData] of brandsArray) {
        const { brand_name, image_url, product_name, price } = brandData;
        
        data.push(brand_name);
        imgList.push(image_url);
        
        imagePositionMap[image_url] = [watchListIndex, brand_name, product_name, price];
        watchListIndex++;
      }
    }
  }
  loadBrands();

  // If imgs is empty, set it to the default list
  if (imgs.length === 0) {
    imgs = imgList.flat();
  }

  const toggleColor = (img) => {
    const index = imagePositionMap[img][0];
    if (typeof window !== 'undefined') {
      const updatedIsRedArray = [...isRedArray];
      updatedIsRedArray[index] = !updatedIsRedArray[index];
      
      let updatedLikedWatches;

      if (updatedIsRedArray[index]) {
        updatedLikedWatches = [...likedWatches, index];
      } else {
        updatedLikedWatches = likedWatches.filter((watchIndex) => watchIndex !== index);
      }
      
      setLikedWatches(updatedLikedWatches);
      localStorage.setItem("likedWatches", JSON.stringify(updatedLikedWatches));
      setIsRedArray(updatedIsRedArray);
    }
  };
  

  const filterImage = () => {
    if(imgs[0] === "showFav"){
      setFavBrands([]);
      setLoadingFavorites(true);
      showFav(true);
      return;
    }
    imgs = filteredData
      .flatMap((brand) =>
        brands
          .filter((b) => b.brand_name.toLowerCase() === brand.toLowerCase())
          .map((watch) => watch.image_url)
      );

    let likedImgsList = []
    for (const index in likedWatches){
      likedImgsList.push(imgList[likedWatches[index]]);
    }
    
    let indexToRemove = [];
    const imgsLength = imgs.length;
    for (let i = 0; i < imgsLength; i++) {  
      for (const likedImg in likedImgsList){
        if(imgs[i] === likedImgsList[likedImg]){
          indexToRemove.push(likedImgsList[likedImg]);
        }
      }      
    }
    imgs = indexToRemove;
    
    newURL();
  };

  const newURL = () => {
    // Construct the new query parameter with the updated variable
    const newQueryParams = new URLSearchParams(window.location.search);
    newQueryParams.set("imgs", imgs.join(","))

    // Replace the current URL with the new query parameters
    const newURL = `${window.location.pathname}?${newQueryParams.toString()}`;
    // used to stop window error messages
    if (isClient) {
      window.history.replaceState(null, "", newURL);
      //router.push("/watches");
    }

    // reload page
    //window.location.reload();
  };

  const viewWatchURL = (index) => {
    let dataToAdd = [];
    dataToAdd.push(imagePositionMap[index]);
    dataToAdd.push(imgList[imagePositionMap[index][0]]);
    // Construct the new query parameter with the updated variable
    const newQueryParams = new URLSearchParams();
    newQueryParams.set("watch", dataToAdd.join(","));
  
    // Used to stop window error messages
    if (isClient) {
      // Use router.push to navigate to the "/viewWatches" page with the new query parameters
      router.push({
        pathname: "/viewWatch",
        query: { watch: dataToAdd.join(",") }
      });
    }
  };

  const checkKeyDown = (e) => {
    const updatedValue = e.target.value;
    setFilteredData(
      [...new Set(favBrands.filter((op) => op.toLowerCase().includes(updatedValue.toLowerCase())))]
    );
    setReload(true);
  };
  
  
  useEffect(() => {
    if(brands !== null){
      const handleReload = () => {
        setReload(false);
        filterImage();
        newURL();
      };
    
      if (reload) {
        handleReload();
      }
    }
  }, [reload, filterImage, newURL]);
  

  const showFav = async () => {

    if (likedWatches.length > 0 ) {
      // If there are liked watches, update the imgs array and filteredData
      
      const storedLikedWatches = localStorage.getItem("likedWatches");
      let likedWatchesList = JSON.parse(storedLikedWatches);

      const likedWatchImages = likedWatchesList.map(
        (index) => imgList.flat()[index]
      );

      imgs = likedWatchImages;
      setFilteredData(
        [...new Set(data.filter((op) => likedWatchImages.includes(brands[op.toLowerCase()])))]
      );
    } else {
      // If there are no liked watches, reset to display all watches
      imgs = imgList.flat();
      setFilteredData([...new Set(data)]);
    }
    newURL();
  };

  useEffect(() => {
    // Initially display all watches
    setFilteredData([...new Set(data)]);
    // Save to localStorage whenever isRedArray changes
    localStorage.setItem("isRedArray", JSON.stringify(isRedArray));
  }, [isRedArray]); 

  useEffect(() => {   
    if (typeof window !== 'undefined') {
      if (imgs.length === 0) {          
        showFav(false);
      } else if (imgs[0] === "showFav") {
        // Set the loadingFavorites state to true before calling showFav(true)
        setLoadingFavorites(true);
        showFav(true);
      }
    }
    if (loadingFavorites) {
      // If favorites are being loaded, reset the state and return to avoid infinite loop
      setLoadingFavorites(false);
      return;
    }
  }, [loadingFavorites, imgs, showFav]);

  if (brands === null) {
    // stop infinite loading when recieving data
    imgList = [];
    data = [];
    imagePositionMap = {};
    watchListIndex = 0;
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: "5vh" }}>Loading...</div>;
  }

  const getImgStyle = (imgIndex, img) => {
    if(img === 'showFav'){
      return isRedArray[imgIndex]
          ? {display: "block"}
          : { filter: "saturate(0%) hue-rotate(0deg)" };
    }
    const index = imagePositionMap[img][0];
    if (typeof window !== 'undefined' && localStorage) {
      let list = [];
      if(localStorage.getItem("likedWatches") !== null){
        list =  localStorage.getItem("likedWatches").slice(1, localStorage.getItem("likedWatches").length - 1).split(",");
      }
      const isRedArrayList =  localStorage.getItem("isRedArray").slice(1, localStorage.getItem("isRedArray").length - 1).split(",");
      if(index.toString() in list){
        const num = list.indexOf(index);
        if(num === -1){
          return isRedArray[index]
          ? {display: "block"}
          : { filter: "saturate(0%) hue-rotate(0deg)" };
        }
        if(isRedArrayList[num] === "true"){
          if (localStorage.getItem("isRedArray")[num] === "true") {
            return isRedArray[likedWatches[index]]
              ? {display: "block"}
              : { filter: "saturate(0%) hue-rotate(0deg)" };
          }
        }
      } else{
        return isRedArray[index]
          ? {display: "block"}
          : { filter: "saturate(0%) hue-rotate(0deg)" };
      }
        
    } else {
      // Handles the case where localStorage is not available
      return {};
    }
      
  };

  const setFavBrandData = (brand) => {
    if(brand in favBrands === false){
      const prevFavBrands = favBrands;
      setFavBrands(prevFavBrands => [...prevFavBrands, brand]);
    }
  }

  return (
    <main>
      <div className="centerHeader">
        <h1>
          <u>Watches</u>
        </h1>
        <input
          list="data"
          value={val}
          onChange={(e) => {
            e.persist(); // Persist the synthetic event
            setVal(e.target.value);
            checkKeyDown(e);
          }}
          placeholder="Search"
        />
        <datalist id="data">
          {filteredData.map((op) => (
            <option key={op}>{op}</option>
          ))}
        </datalist>
        {/* {<h1>{val}</h1>} */}
      </div>
      <div className="watches-container row">
        {imgs.map((img, index) => (
          <div className="column" key={index}>
            <div className="watches-background">
              <div className="overlay">
                <Image
                  className="favicon"
                  width={30}
                  src={heartImage}
                  //src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Kv4K4TnVfDuANmqwl2FM3NPs-vORr7aFMbhIfVA4gAFCkOY50ZCFb4ZyxRwzCE3KSTA&usqp=CAU"
                  onClick={() => toggleColor(img)}
                  style={getImgStyle(index, img)}
                />
              </div>
              <img src={img} alt={`Watch ${index}`} onLoad={() => setFavBrandData(imagePositionMap[img][1])} />
              <div className="center">        
                <h1>
                  <b style={{textTransform: 'capitalize'}}>
                  {imagePositionMap[img] ? imagePositionMap[img][1] : "N/A"}{" "}
                  </b>
                </h1>
                <p>
                  {imagePositionMap[img] ? imagePositionMap[img][2] : "N/A"}{" "}
                </p>
                {saleAmount !== 0 && (
                <p>
                  <span style={{textDecoration: 'line-through'}}>£{imagePositionMap[img] ? imagePositionMap[img][3] : "N/A"}{" "}</span>
                  &nbsp;&nbsp;£{((imagePositionMap[img] ? imagePositionMap[img][3] : 0) - ((imagePositionMap[img] ? imagePositionMap[img][3] : 0) * (saleAmount / 100))).toFixed(2)}
                </p>
                )}
                {saleAmount === 0 && (
                <p>
                  £{imagePositionMap[img] ? imagePositionMap[img][3] : "N/A"}{" "}                  
                </p>
                )}
              </div>
              <div className="overlay">
                <button className="button" onClick={() => viewWatchURL(img)}>
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default LoadPage;
