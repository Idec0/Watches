import 'styles/globals.css';
import React from 'react';
import Link from 'next/link';

function LoadPage() {
  return (
    <div className='successful-parent-container'>
      <div className='successful-child-container'>
        <h1><u>✅ Payment Successful</u></h1>
        <p>We recieved your purchase request;</p>
        <p>We'll be in touch shortly!</p>
        <Link href="/">
          <button>Back to Store</button>
        </Link>
      </div>
    </div>
  );
}

export default LoadPage;