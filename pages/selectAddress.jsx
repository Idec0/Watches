"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
import Link from 'next/link';

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 

  return (
    <main className="flex min-h-screen flex-col items-center navbar-size">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<SaveAddressPage />}
    </main>
  );
}

function SaveAddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [amount, setAmount] = useState("0");

  const isClient = typeof window !== 'undefined';
  const search = isClient ? window.location.search : '';
  const get_amount = isClient ? new URLSearchParams(search).get('amount') : '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      var username = localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false;
    }
    displayAddresses(username);
    setAmount(get_amount);
  }, []);

  const displayAddresses = async (username) => {
    try {
      var user = {getAddresses: username}
      const queryParams = new URLSearchParams(user).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setAddresses(result);
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const deleteAddress = async(address_id) => {
    try {
      var addressToDelete = {addressToDelete: address_id}
      const queryParams = new URLSearchParams(addressToDelete).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }catch (error) {
      console.error('Error fetching data:', error);
    }
    window.location.href="/selectAddress?amount=" + amount;
  }

  {
    return (
      <main style={{width: '100%'}}>
         <div className='admin-panel-details' style={{margin: '10px 0', paddingTop: '10px'}}>
            <div className="scrollable-table">
              <table style={{width: '80%', margin: 'auto', fontSize: '80%'}}>
                <tbody>
                  <tr>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Address Line 1</th>
                    <th>Address Line 2</th>
                    <th>City</th>
                    <th>Postcode</th>
                    <th>Phone Numeber</th>
                    <th>Email</th>
                  </tr>
                  {addresses.map((address) => (
                  <tr key={address.id}>                  
                    <td>{address.firstname}</td>
                    <td>{address.lastname}</td>
                    <td>{address.addressline1}</td>
                    <td>{address.addressline2}</td>
                    <td>{address.city}</td>
                    <td>{address.postcode}</td>
                    <td>{address.phonenumber}</td>
                    <td>{address.email}</td>
                    <Link
                      href={{
                        pathname: '/checkout',
                        query: {
                          address: address.id,
                          amount: amount
                        }
                      }}
                    >
                      <p className='selectAddressButton' style={{ color: 'white', marginLeft: '10px'}}>Select</p>
                    </Link>
                    <p className='selectAddressButton' style={{ color: 'white', marginLeft: '10px', cursor: 'pointer'}} onClick={() => deleteAddress(address.id)}>Delete</p>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </main>
    );
  }
}

export default LoadPage;
