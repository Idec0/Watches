import 'styles/globals.css';
import React from 'react';
import Link from 'next/link';

function LoadPage() {

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("loggedIn", false);
      window.location.href = "/login";
    }
  }

  return (
    <div className='successful-parent-container'>
      <div className='successful-child-container'>
        <h1><u>Permanently Banned</u></h1>
        <p style={{margin: '30px 5vw', marginBottom: '0px'}}>Your account has been disabled for violating our terms.</p>
        <Link href="/logout">
          <button style={{padding: '15px 40px', borderRadius: '4px'}} onClick={() => logout()}>Logout</button>
        </Link>
      </div>
    </div>
  );
}

export default LoadPage;