"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
import Image from 'next/image'
import watchImage from "public/loginBackground.png";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<IndexPage />}
    </main>
  );
}

function IndexPage() {
  {
    const LoginButtonClicked = async () => {
      var email = document.getElementById("email").value
      var password = document.getElementById("password").value
      console.log(email);
      console.log(password);

      // get email and password from user table
      try {
        // add new user to database
        var user = {email: email, password: password}
        const queryParams = new URLSearchParams(user).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);

        user = result;
        if(user !== "Unauthorized"){
          console.log("password correct");
          if (typeof window !== 'undefined') {
            localStorage.setItem("loggedIn", true);        
          }
          window.location.href = "/";
        }
        else{
          console.log("Password was incorrect");
        }

      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    return (
      <main>
        <div className='split-grid-container'>
          <div className='item1'>
            <Image
              src={watchImage}
              alt="Picture of Watch banner"
              width={600}
            />
          </div>
          <div className='item2'>
            <div className='login-right-content'>              
              <input placeholder='Email' type="email" id="email" />
              <input placeholder='Password' type='password' id="password" />
              <button onClick={() => LoginButtonClicked()}>Login</button>
              <a href='/createAccount'>
                <button>Create Account</button>
              </a>
            </div>            
          </div>
        </div>        
      </main>
    );
  }
}

export default LoadPage;
