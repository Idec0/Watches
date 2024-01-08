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
    const CreateAccountButtonClicked = async () => {
      var username = document.getElementById("username").value
      var password = document.getElementById("password").value
      var confirmPassword = document.getElementById("confirmPassword").value
      var firstname = document.getElementById("firstname").value
      var lastname = document.getElementById("surname").value
      var email = document.getElementById("email").value
      console.log(username);
      console.log(password);
      console.log(confirmPassword);
      console.log(firstname);
      console.log(lastname);
      console.log(email);

      try {
        // add new user to database
        var user = {username: username, password: password, firstname: firstname, lastname: lastname, email: email}
        const queryParams = new URLSearchParams(user).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
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
              <input style={{ marginTop: '0px' }} placeholder='Username' id="username"/>
              <input placeholder='Password' type='password' id="password" />
              <input placeholder='Confirm Password'  type='password' id="confirmPassword" />
              <input placeholder='Email' id="email" type='email'/>
              <input placeholder='First Name' id="firstname"/>
              <input placeholder='Surname' id="surname"/>
              <button onClick={() => CreateAccountButtonClicked()}>Create Account</button>
              <a href='/login'>
                <button>Login</button>
              </a>              
            </div>            
          </div>
        </div>        
      </main>
    );
  }
}

export default LoadPage;
