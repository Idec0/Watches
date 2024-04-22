import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = ({ appVisible, setAppVisible }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  
  const router = useRouter();
  const showCalc = () => {
    setAppVisible(!appVisible);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("loggedIn", false);
      router.push("/login");
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      userSuspendedandBanned(localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false);
      setLoggedIn(localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false);
      
      SetAdmin(localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false);
    }
  }, []); 

  const userSuspendedandBanned = async(username) => {
    // get user info
    try {
      var user = {userSuspension: username}
      const queryParams = new URLSearchParams(user).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      const date = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      try{
        if(date.user[0].ban === "true" || date.user[0].suspended_date !== "none"){
          if(date.user[0].ban === "true"){
            window.location.href="/banned";
          }
          else{
            window.location.href="/suspended";
          }
        } 
      }catch{
        console.log("Ban is undefined:date.user[0].ban ")
      }      

    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const SetAdmin = async(username) => {
    // check if admin
    try {
      var user = {isAdmin: username}
      const queryParams = new URLSearchParams(user).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setAdmin(result.user[0] ? result.user[0].admin : false);
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  return (
    <>
      <div
      className="w-full h-20 bg-emerald-800 sticky top-0 navbar">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <ul className="md:flex gap-x-6 text-white items-center nav-text">
              <li>
                <Link href={"/"}  style={{color:"white"}}>Home</Link>
              </li>
              <li>
                <Link href={"/watches"} style={{color:"white"}}>Watches</Link>
              </li>
              <li>
                <button type="button" onClick={() => showCalc()}>
                  <p style={{color:"white"}}>Calculator</p>
                </button>
              </li>
              <li>
                <Link href={"/favourites?imgs=showFav"}>❤️</Link>
              </li>

              <Link href={"/basket"}>🛒</Link>
              {loggedIn === "false" && (
              <li>
                <div className="dropdown">
                  <p>👤</p>
                  <div className="dropdown-content">
                    <Link href={"/login"}>Login</Link>
                  </div>
                </div>
              </li>
            )}
              {loggedIn !== "false" && (
              <li>
                <div className="dropdown">
                  <p>👤</p>
                  <div className="dropdown-content">
                  {admin !== false && (
                    <Link href={"/adminPanel"}>Admin Panel</Link>
                  )}
                    <a href={"/orderHistory"}><p style={{cursor: 'pointer'}}>History</p></a>
                    <p style={{cursor: 'pointer'}} type="button" onClick={() => logout()}>Logout</p>
                  </div>
                </div>
              </li>
            )}

            </ul>
          </div>
        </div>
        {appVisible && <App />}
      </div>

    </>
  );
};

function App() {
  const [calc, setCalc] = useState("");
  const [result, setResult] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const middleX = Math.floor((window.innerWidth / 2) - 190); 
  const [position, setPosition] = useState({ x: middleX, y: 250 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const ops = ["/", "*", "+", "-", "."];

  const handleAnswerChange = (event) => {
    if (isFinite(event.key) || ops.includes(event.key)) {
      updateCalc(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
      calculator();
    } else if (event.key === "Backspace") {
      deleteLast();
    } else if (event.key === "c") {
      clear();
    } else if (event.key === "(" || event.key === ")") {
      updateCalc(event.key);
    }
  };

  const updateCalc = (value) => {
    if (
      (ops.includes(value) && calc === "") ||
      (ops.includes(value) && ops.includes(calc.slice(-1)))
    ) {
      return;
    }

    setCalc(calc + value);

    if (!ops.includes(value)) {
      try {
        setResult(eval(calc + value).toString());
      } catch {
        //
      }
    }
  };

  const createDigits = () => {
    const digits = [];

    for (let i = 1; i < 10; i++) {
      digits.push(
        <button onClick={() => updateCalc(i.toString())} key={i}>
          {i}
        </button>
      );
    }

    return digits;
  };

  const calculator = () => {
    try {
      // 2(2+2) doesn't work but 2*(2+2) does
      const result = eval(calc);
      if (isNaN(result)) {
        setResult("Invalid Input");
        clear();
      } else {
        setCalc(result.toString());
      }
    } catch (error) {
      setResult("Error");
      // if user inputs 2(2+2) then auto input *
      if (calc.includes("(")) {
        let index = calc.indexOf("(");

        if (!ops.includes(calc[index - 1])) {
          setCalc(calc.slice(0, index) + "*" + calc.slice(index));
        }
      }
    }
  };

  const deleteLast = () => {
    if (calc == "") {
      return;
    }

    const value = calc.slice(0, -1);

    setCalc(value);
  };

  const clear = () => {
    setCalc("");
    setResult("");
  };

  /* draggable */
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
     const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setOffset({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - offset.x,
      y: clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const calculatorStyle = {
    position: "absolute",
    left: position.x + "px",
    top: position.y + "px",
    cursor: isDragging ? "grabbing" : "grab",
    transition: isDragging ? "none" : "left 0.15s, top 0.15s",
  };

  return (
    <div className="App">
      <div
        className="calculator"
        style={calculatorStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <div className="display">
          {result ? <span>({result})</span> : ""}&nbsp;
          <input
            type="text"
            value={calc || "0"}
            onKeyDown={handleAnswerChange}
          />
        </div>
        <div className="operators">
          <button onClick={() => updateCalc("/")}>/</button>
          <button onClick={() => updateCalc("*")}>*</button>
          <button onClick={() => updateCalc("+")}>+</button>
          <button onClick={() => updateCalc("-")}>-</button>
          <button onClick={() => updateCalc("(")}>(</button>
          <button onClick={() => updateCalc(")")}>)</button>

          <button onClick={clear}>C</button>
          <button onClick={deleteLast}>DEL</button>
        </div>
        <div className="digits">
          {createDigits()}
          <button onClick={() => updateCalc("0")}>0</button>
          <button onClick={() => updateCalc(".")}>.</button>
          <button onClick={calculator}>=</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
