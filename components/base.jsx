import React, { useState } from "react";
import Link from "next/link";

const imgs = [];

const Navbar = ({ appVisible, setAppVisible }) => {
  const showCalc = () => {
    setAppVisible(!appVisible);
  };

  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0 navbar">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <ul className="md:flex gap-x-6 text-white  items-center">
              <li>
                <Link href={"/"}  style={{color:"white"}}>Home</Link>
              </li>
              <li>
                <Link href={"/watches"}  style={{color:"white"}}>Watches</Link>
              </li>
              <li>
                <button type="button" onClick={() => showCalc()}>
                  <p style={{color:"white"}}>Calculator</p>
                </button>
              </li>
              <li>
                <Link href={"/watches?imgs=showFav"}>❤️</Link>
              </li>

              <Link href={"/basket"}>🛒</Link>
              <Link href={"/login"}>👤</Link>
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
  const [position, setPosition] = useState({ x: 600, y: 250 });
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
      console.log("()");
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
      console.log(calc);
      // if user inputs 2(2+2) then auto input *
      if (calc.includes("(")) {
        console.log("error caused by (");
        let index = calc.indexOf("(");
        console.log(index);

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
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
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
