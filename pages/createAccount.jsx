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
  
  const [usernameText, setUsernameText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [confirmPasswordText, setConfirmPasswordText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [firstnameText, setFirstnameText] = useState('');
  const [surnameText, setSurnameText] = useState('');

  {
    const CreateAccountButtonClicked = async () => {
      var username = document.getElementById("username").value
      var password = document.getElementById("password").value
      var confirmPassword = document.getElementById("confirmPassword").value
      var firstname = document.getElementById("firstname").value
      var lastname = document.getElementById("surname").value
      var email = document.getElementById("email").value

      try {
        setUsernameText("");
        setPasswordText("");
        setConfirmPasswordText("");
        setEmailText("");
        setFirstnameText("");
        setSurnameText("");
        // validation for inputs
        if(username != "" && username.length > 3 && username.length < 256 ){
          var user = {usernameCheck: username}
          const queryParams = new URLSearchParams(user).toString();
          const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          if(result === "true"){
            setUsernameText("Username Taken");
            return;
          }
          
        }
        else{
          setUsernameText("Username must be at least 4 characters long");
          return;
        }             
        
        if(firstname.length === 0 || firstname.length > 256){          
          setFirstnameText("Can't be left blank!");
          return;
        }
        
        if(lastname.length === 0 || lastname.length > 256){
          setSurnameText("Can't be left blank!");
          return;
        }

        if(email !== "" && email.includes("@") && email.indexOf('@') !== email.length - 1 && email.includes(".") && email.indexOf('.') !== email.length - 1 && email.length < 256){
          var email_check = {emailCheck: email}
          const queryParams = new URLSearchParams(email_check).toString();
          const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          if(result === "true"){
            setEmailText("Email Already in use");
            return;
          }
          
        }
        else{
          setEmailText("Email must be valid");
          return;
        }

        if(password.length < 8 || password.length > 256){
          setPasswordText("Passwords must contain at least 8 characters");
          return;
        }
        
        if(password !== confirmPassword){
          setConfirmPasswordText("Passwords does not match");
          return;
        }   

        // add new user to database
        console.log("a");
        var user = {username: username, password: password, firstname: firstname, lastname: lastname, email: email}
        const queryParams = new URLSearchParams(user).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        console.log("b");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("asd");
        window.location.href="/";
        //const result = await response.json();
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
            <div className='login-right-content signup-left-content'>              
              <input onChange={() => CreateAccountButtonClicked()} style={{marginTop: '0px'}} placeholder='Username' id="username"/>
              <p className = 'login-right-content-p'>{usernameText}</p>
              <input onChange={() => CreateAccountButtonClicked()} placeholder='First Name' id="firstname"/>
              <p className = 'login-right-content-p'>{firstnameText}</p>
              <input onChange={() => CreateAccountButtonClicked()} placeholder='Surname' id="surname"/>
              <p className = 'login-right-content-p'>{surnameText}</p>
              <input onChange={() => CreateAccountButtonClicked()} placeholder='Email' id="email" type='email'/>
              <p className = 'login-right-content-p'>{emailText}</p>
              <input onChange={() => CreateAccountButtonClicked()} placeholder='Password' type='password' id="password" />
              <p className = 'login-right-content-p'>{passwordText}</p>
              <input onChange={() => CreateAccountButtonClicked()} placeholder='Confirm Password' type='password' id="confirmPassword" />
              <p className = 'login-right-content-p'>{confirmPasswordText}</p>
              <button onClick={() => CreateAccountButtonClicked()}>Create Account</button>
              <p className = 'login-right-content-p'></p>
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
