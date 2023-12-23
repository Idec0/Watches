"use client";

import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
import { useRouter } from "next/navigation";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      <WatchesPage />
    </main>
  );
}

/* TODO:
calculator is behind checkout on basket page

discounts saves when you refresh the basket page

user login / signup

ability to add sales / discounts

move brands data to database - also add ability to add / edit watches and brands

test to see if the app can prevent SQL injections


Done Today:
Website has been build and deployed on vercel
database is connected to the website, so now i can recieve data from the database - this required me to change the whole layout since I didn't have a directory called pages, which is the way you are meant to do it
added security to prevent SQL injections in db.js 
refreshing the viewWatch page doesn't remove all the data anymore
basket page auto refreshes when you bin / remove an item
search bar auto filters as you're typing instead of having to hit enter to search 
You can now apply discounts buy typing it in the basket, which then shows you the percentage of with the new price - gets the info from the database
Sales image now works so now i dont have to use a url link
*/

const WatchesPage = () => {
  const router = useRouter();

  const [val, setVal] = useState("");
  const [reload, setReload] = useState(true);
  const [isRedArray, setIsRedArray] = useState([]);
  const [likedWatches, setLikedWatches] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false); // fix infinite loop for fav page

  const isClient = typeof window !== 'undefined'; // Check if window is defined

  // code to pass a varibale through links

  // Access the search part of the URL, e.g., '?param1,param2,param3'
  const search = isClient ? window.location.search : '';

   // Extract the variable from the search
   const variable = isClient ? new URLSearchParams(search).get('imgs') : '';

   // Parse the variable back into an array
   let imgs = variable ? variable.split(',') : [];
  // end of code to pass a varibale through links

  // Wrap code that relies on client-side features in a check for window
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIsRedArray = localStorage.getItem("isRedArray");
      const storedLikedWatches = localStorage.getItem("likedWatches");

      setIsRedArray(storedIsRedArray ? JSON.parse(storedIsRedArray) : []);
      setLikedWatches(storedLikedWatches ? JSON.parse(storedLikedWatches) : []);
    }
  }, []);
  

  const brands = {
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
  const imagePositionMap = {};
  let watchListIndex = 0;
  for (const brand in brands) {
    data.push(brand);
    brands[brand].forEach((imageURL) => {
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

  // If imgs is empty, set it to the default list
  if (imgs.length === 0) {
    imgs = imgList.flat(); // Assuming imgList is defined somewhere in your component
  }

  const [filteredData, setFilteredData] = useState(data); // State variable for filtered options  

  const toggleColor = (index) => {
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
    imgs = filteredData
      .map((brand) => brands[brand.toLowerCase()].map((watch) => watch[0]))
      .flat();
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
      data.filter((op) => op.toLowerCase().includes(updatedValue.toLowerCase()))
    );
    console.log(filteredData);
    setReload(true);
  };
  

  useEffect(() => {
    if (reload) {
      console.log("Reload");
      setReload(false);
      filterImage();
      newURL();
    }
  }, [reload, filterImage, newURL]);
  

  const showFav = (loadFav) => {
    console.log("isRedArray:", isRedArray);
    if (likedWatches.length > 0 && loadFav === true) {
      // If there are liked watches, update the imgs array and filteredData
      const likedWatchImages = likedWatches.map(
        (index) => imgList.flat()[index]
      );
      imgs = likedWatchImages;
      setFilteredData(
        data.filter((op) => likedWatchImages.includes(brands[op.toLowerCase()]))
      );
    } else {
      // If there are no liked watches, reset to display all watches
      imgs = imgList.flat(); // flatten the imgList array
      setFilteredData(data);
    }

    const updatedLikedWatches = imgs.reduce((acc, img, index) => {
      let watchPosition = imagePositionMap[imgs[index]][0];
      const imgIndex = imgList.flat().indexOf(img);
      if (likedWatches.includes(imgIndex)) {
        acc.push(imgIndex);
      }
      return acc;
    }, []);

    setLikedWatches(updatedLikedWatches);
    localStorage.setItem("likedWatches", JSON.stringify(updatedLikedWatches));
    newURL();
  };

  useEffect(() => {
    // Initially display all watches
    setFilteredData(data);
    // Save to localStorage whenever isRedArray changes
    localStorage.setItem("isRedArray", JSON.stringify(isRedArray));
  }, [isRedArray]);

  useEffect(() => {  
    if (typeof window !== 'undefined') {
      if (imgs.length === 0) {
        console.log("imgs empty");
        localStorage.setItem("loadLikedWatches", "false");
        showFav(false);
      } else if (imgs[0] === "showFav") {
        // Set the loadingFavorites state to true before calling showFav(true)
        setLoadingFavorites(true);
        localStorage.setItem("loadLikedWatches", "true");
        showFav(true);
      }
    }
    if (loadingFavorites) {
      // If favorites are being loaded, reset the state and return to avoid infinite loop
      setLoadingFavorites(false);
      return;
    }
  }, [loadingFavorites, imgs, showFav]);

  const getImgStyle = (index) => {
    if (typeof window !== 'undefined' && localStorage) {
      if (localStorage.getItem("loadLikedWatches") === "true") {
        console.log(localStorage.getItem("loadLikedWatches"));
        return isRedArray[likedWatches[index]]
          ? {}
          : { filter: "saturate(0%) hue-rotate(0deg)" };
      } else {
        return isRedArray[index]
          ? {}
          : { filter: "saturate(0%) hue-rotate(0deg)" };
      }
    } else {
      // Handles the case where localStorage is not available
      return {};
    }
  };
  


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
        {<h1>{val}</h1>}
      </div>
      <div className="watches-container row">
        {imgs.map((img, index) => (
          <div className="column" key={index}>
            <div className="watches-background">
              <div className="overlay">
                <img
                  className="favicon"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Kv4K4TnVfDuANmqwl2FM3NPs-vORr7aFMbhIfVA4gAFCkOY50ZCFb4ZyxRwzCE3KSTA&usqp=CAU"
                  onClick={() => toggleColor(index)}
                  style={getImgStyle(index)}
                ></img>
              </div>
              <img src={img} alt={`Watch ${index}`} />
              <div className="center">
                <h1>
                  <b>
                    {imagePositionMap[img]
                      ? imagePositionMap[img][1].charAt(0).toUpperCase() +
                        imagePositionMap[img][1].slice(1)
                      : "N/A"}{" "}
                  </b>
                </h1>
                <p>
                  {imagePositionMap[img] ? imagePositionMap[img][2] : "N/A"}{" "}
                </p>
                <p>
                  £{imagePositionMap[img] ? imagePositionMap[img][3] : "N/A"}{" "}
                </p>
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
