import 'styles/globals.css';
import React from 'react';
import Link from 'next/link';

function LoadPage() {
  return (
    <div className='successful-parent-container'>
      <div className='successful-child-container'>
        <h1><u>✅ Refund Successful</u></h1>
        <p>We recieved your refund request;</p>
        <p style={{margin: '40px 5vw'}}>Your refund will be processed and the funds will be transferred back to your account within 14 business days.</p>
        <Link href="/orderHistory">
          <button style={{width: '140px'}}>Close</button>
        </Link>
      </div>
    </div>
  );
}

export default LoadPage;