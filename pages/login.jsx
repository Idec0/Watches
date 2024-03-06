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
    <main className="flex min-h-screen flex-col items-center navbar-size">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<IndexPage />}
    </main>
  );
}

function IndexPage() {
  const [passwordText, setPasswordText] = useState("");
  {
    const LoginButtonClicked = async () => {
      var email = document.getElementById("email").value
      var password = document.getElementById("password").value

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

        user = result;
        if(user !== "Unauthorized"){
          setPasswordText("");
          if (typeof window !== 'undefined') {
            localStorage.setItem("loggedIn", user.user[0].username);        
          }
          window.location.href = "/";
        }
        else{
          setPasswordText("Username or Password was Incorrect");
        }

      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    return (
      <main style={{width: '100%'}}>
        <div className='split-grid-container'>
          <div className='watchPic'>
            <Image
              src={watchImage}
              alt="Picture of Watch banner"
              width={600}
              className='watchPicImg'
            />
          </div>
          <div className='input'>
            <div className='login-right-content'>              
              <input placeholder='Email' type="email" id="email" />
              <input placeholder='Password' type='password' id="password" />
              <p className = 'login-text'>{passwordText}</p>
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
