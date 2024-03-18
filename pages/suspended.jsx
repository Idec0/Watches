import 'styles/globals.css';
import React from 'react';
import { useState, useEffect } from 'react';

function LoadPage() {
  const [suspendedUntil, setSuspendedUntil] = useState("00/00/0000");

  useEffect(() => {
    if (typeof window !== 'undefined') {      
        userSuspended(localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false);
    }
  }, []); 

  const userSuspended = async(username) => {
    // get user info
    try {
      var user = {userSuspension: username}
      const queryParams = new URLSearchParams(user).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      const date = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setSuspendedUntil(date.user[0].suspended_date);

    }catch (error) {
      console.error('Error fetching data:', error);
      setSuspendedUntil("00/00/0000");
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("loggedIn", false);
      window.location.href = "/login";
    }
  }

  return (
    <div className='successful-parent-container'>
      <div className='successful-child-container'>
        <h1><u>Suspended</u></h1>
        <p style={{margin: '30px 5vw', marginBottom: '0px'}}>Your account has been disabled for violating our terms.</p>
        <p style={{margin: '30px 5vw', marginBottom: '0px'}}>Your account will be disabled until { suspendedUntil }.</p>
        <button style={{padding: '15px 40px', borderRadius: '4px'}} onClick={() => logout()}>Logout</button>
      </div>
    </div>
  );
}

export default LoadPage;