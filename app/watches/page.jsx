"use client";

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
if you're on the watches page and then click on favourites, you have to then manually refresh the page or else it goes into an infinite refresh loop
- calculator refreshes the page automatically - causes problems on the view watch, favourites page.

calculator is behind checkout on basket page

can't get sales image to display, so for now i will use a url link

cant unfavourite watches on the favourites page - due to page refreshing, which causes to display all
when you heart a watch it refreshes the page so if your scrolling down you will be brought back up to the top

refreshing viewWatch page removes everything

need to add auto refresh to the basket page when you remove a watch 

user login / signup
ability to add sales / discounts

test to see if the app can prevent SQL injections

Done Today:
Website has been build and deployed on vercel
*/

const WatchesPage = () => {
  const router = useRouter();

  const isClient = typeof window !== 'undefined'; // Check if window is defined

  // code to pass a varibale through links

  // Access the search part of the URL, e.g., '?param1,param2,param3'
  const search = isClient ? window.location.search : '';

   // Extract the variable from the search
   const variable = isClient ? new URLSearchParams(search).get('imgs') : '';

   // Parse the variable back into an array
   let imgs = variable ? variable.split(',') : [];
  // end of code to pass a varibale through links


  const [val, setVal] = useState("");

  const [reload, setReload] = useState(true);

  const [isRedArray, setIsRedArray] = useState([]);
  const [likedWatches, setLikedWatches] = useState([]);

  // Wrap code that relies on client-side features in a check for window
  
    useEffect(() => {
      const isClient = typeof window !== 'undefined';
      if (isClient) {
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
    fossil: [
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/34b4a13777517e40e5b794fdc3ecddeb/f/s/fs5380_grey.jpg",
        "Mens Neutra Chronograph Watch FS5380",
        159,
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
    tissot: [
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/dcbf10923bf8373a37990fd538c120d9/2/3/23-52-420_grey.jpg",
        "PRC 200 Stainless Steel Blue Dial Chronograph Watch T114.417.11.047.00",
        480,
      ],
    ],
    oris: [
      [
        "https://www.houseofwatches.co.uk/media/catalog/product/cache/dcbf10923bf8373a37990fd538c120d9/2/4/24-56-127_grey.jpg",
        "Mens Divers Sixty-Five Brown Leather Strap Watch 733 7720 4055-07 5 21 02",
        1900,
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

  const [filteredData, setFilteredData] = useState(data); // State variable for filtered options

  // const [isRedArray, setIsRedArray] = useState(() => {
  //   // Try to get the count from localStorage, or default to an array of false values
  //   if (typeof window !== 'undefined'){
  //     const storedValue = localStorage.getItem("isRedArray");
  //     try {
  //       return storedValue
  //         ? JSON.parse(storedValue)
  //         : new Array(imgs.length).fill(false);
  //     } catch (error) {
  //       console.error("Error parsing JSON from localStorage:", error);
  //       return new Array(imgs.length).fill(false);
  //     }
  //   }
  // });
  

  const toggleColor = (index) => {
    if (isClient) {
      console.log(index);
      const updatedIsRedArray = [...isRedArray];
      updatedIsRedArray[index] = !updatedIsRedArray[index];

      requestAnimationFrame(() => {
        let updatedLikedWatches;
        let watchPosition = imagePositionMap[imgs[index]][0];
        console.log(updatedIsRedArray[index]);
        if (updatedIsRedArray[index]) {
          console.log(watchPosition);
          // If the watch is being liked, add its original index to likedWatches
          updatedLikedWatches = [...likedWatches, watchPosition];
        } else {
          // If the watch is being unliked, remove its original index from likedWatches
          updatedLikedWatches = likedWatches.filter(
            (watchIndex) => watchIndex !== watchPosition
          );
        }
        setLikedWatches(updatedLikedWatches);
        localStorage.setItem("likedWatches", JSON.stringify(updatedLikedWatches));

        setIsRedArray(updatedIsRedArray);
        console.log(isRedArray[likedWatches[index]]);
      });
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
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, "", newURL);
      router.push("/watches"); // sets url to watches so variables aren't shown on the url
    }

    // reload page
    //window.location.reload();
  };

  const viewWatchURL = (index) => {
    let dataToAdd = [];
    dataToAdd.push(imagePositionMap[index]);
    dataToAdd.push(imgList[imagePositionMap[index][0]]);
    // Construct the new query parameter with the updated variable
    const newQueryParams = new URLSearchParams(window.location.search);
    newQueryParams.set("watch", dataToAdd.join(","));

    // Replace the current URL with the new query parameters
    const newURL = `${window.location.pathname}?${newQueryParams.toString()}`;
    // used to stop window error messages
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, "", newURL);
      router.push("/viewWatch"); // sets url to viewwatch so variables aren't shown on the url
    }
        

    // reload page
    //window.location.reload();
  };

  const checkKeyDown = (event) => {
    if (event.key === "Enter") {
      setFilteredData(
        data.filter((op) => op.toLowerCase().includes(val.toLowerCase()))
      );
      setReload(true);
    }
  };

  useEffect(() => {
    if (reload) {
      console.log("reload");
      setReload(false);
      filterImage();
      newURL();
    }
  }, [reload]);
  

  const showFav = (loadFav) => {
    console.log("isRedArray:", isRedArray);
    if (likedWatches.length > 0 && loadFav === true) {
      // If there are liked watches, update the imgs array and filteredData
      const likedWatchImages = likedWatches.map(
        (index) => imgList.flat()[index]
      );
      imgs = likedWatchImages;
      console.log(imgs);
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
    console.log("imgs array:", imgs);
    // Initially display all watches
    setFilteredData(data);
    // Save to localStorage whenever isRedArray changes
    localStorage.setItem("isRedArray", JSON.stringify(isRedArray));
    console.log("isRedArray updated:", isRedArray);
  }, [isRedArray]);

  //const [loadLikedWatches, setLoadLikedWatches] = useState(false);
  if (typeof window !== 'undefined') {
    if (imgs.length === 0) {
      // If there are no watches in imgs, reset to display all watches
      console.log("imgs empty");
      localStorage.setItem("loadLikedWatches", "false");
      showFav(false);
    } else if (imgs[0] === "showFav") {
      localStorage.setItem("loadLikedWatches", "true");
      showFav(true);
    }
  }

  const getImgStyle = (index) => {
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
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={checkKeyDown}
          placeholder="Search"
        />
        <datalist id="data">
          {filteredData.map((op) => (
            <option key={op}>{op}</option>
          ))}
        </datalist>
        {/*<h1>{val}</h1>*/}
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
