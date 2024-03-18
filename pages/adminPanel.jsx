"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 
  return (
    <main className="flex min-h-screen flex-col items-center navbar-size">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<AdminPage />}
    </main>
  );
}

function AdminPage() {
  const [title, setTitle] = useState("Admin Panel");
  const [discounts, setDiscounts] = useState([]);
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [watches, setWatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {      
      SetAdmin(localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false);
    }
  }, []); 

  const SetAdmin = async(username) => {
    // check if admin
    try {
      var user = {isAdmin: username}
      const queryParams = new URLSearchParams(user).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      const isAdmin = result.user[0] ? result.user[0].admin : false;
      if(!isAdmin || result.user[0].ban === "true" || result.user[0].suspended_date !== "none"){
        window.location.href="/";
      }
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const setDisplayTitle = async (text) => {
    setTitle(text);
    if(text === "Edit Discounts"){
      try {
        // get discounts
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent("get_discounts")}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setDiscounts(result);
      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(text === "Edit Watches"){
      try {
        // get watches
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent("Brands")}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        var brands = result.discounts;
        setWatches(brands);

      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(text === "Edit Sales"){
      try {
        // get sales
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent("get_sales")}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setSales(result);
      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(text === "Edit Users"){
      try {
        // get users
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent("get_users")}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setUsers(result.users);
      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }

  const addNewWatch = async () => {
    var brand_name = document.getElementById("brand_name").value
    var image_url = document.getElementById("image_url").value
    var image_url2 = document.getElementById("image_url2").value
    var image_url3 = document.getElementById("image_url3").value
    var product_name = document.getElementById("product_name").value
    var price = document.getElementById("price").value

    try {
      // add new watch to database
      var watch = {brand_name: brand_name, image_url: image_url, image_url2: image_url2, image_url3: image_url3, product_name: product_name, price: price}
      const queryParams = new URLSearchParams(watch).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      window.location.reload();
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const editDiscount = async (discount) => {
    var discountElement = document.getElementById(discount.discount_code);
    var discountAmountElement = document.getElementById(`${discount.discount_code} amount`);
    var discountDateElement = document.getElementById(`${discount.discount_code} date`);
    var discountDeleteElement = document.getElementById(`${discount.discount_code} delete`);

    let elements = [];
    elements.push(discountAmountElement);
    elements.push(discountDateElement);

    let discountType = []

    if (discountElement.innerHTML === "Save") {
      discountElement.innerHTML = "Edit";      
      discountDeleteElement.style.display = 'none';
      
      var discountAmountElement = document.getElementById(`${discount.discount_code} amount`);

      discountType.push(discountAmountElement.children[0].value);
      discountType.push(discountDateElement.children[0].value);


      for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = discountType[i];
      }

      // save changes
      try {
        var discount = {save_discount_changes: "True", discount_code: discount.discount_code, discount_amount: discountType[0], end_date: discountType[1]}
        const queryParams = new URLSearchParams(discount).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }catch (error) {
        console.error('Error fetching data:', error);
      }

      setDisplayTitle("Edit Discounts");

    }else{
      discountElement.innerHTML = "Save";
      discountDeleteElement.style.display = 'block';

      discountType.push(discount.discount_amount);
      discountType.push(new Date(discount.end_date).toISOString().split('T')[0]);

      for (let i = 0; i < elements.length; i++) {
        var inputElement = document.createElement("input");
    
        inputElement.type = "text";
        inputElement.value = discountType[i];
        //inputElement.style.width = '40px';
        inputElement.classList.add('admin-panel-details-table-input');
        
    
        elements[i].innerHTML = "";
        elements[i].appendChild(inputElement);
      }
    }
  }

  const addNewDiscount = async () => {
    var discount_code = document.getElementById("new_discount_code").value
    var discount_amount = document.getElementById("new_discount_amount").value
    var end_date = document.getElementById("new_discount_end_date").value

    try {
      // add new user to database
      var discount = {add_discount: "True", discount_code: discount_code, discount_amount: discount_amount, end_date: end_date}
      const queryParams = new URLSearchParams(discount).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      window.location.reload();

    }catch (error) {
      console.error('Error fetching data:', error);
    }    
  }

  const deleteDiscount = async (discount) => {
    try {
      // add new user to database
      const discount_to_delete = { delete_discount: discount.discount_code };
      const queryParams = new URLSearchParams(discount_to_delete).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    }catch (error) {
      console.error('Error fetching data:', error);
    }
    setDisplayTitle("Edit Discounts");
  }

  const editWatch = async (watch) => {
    var discountElement = document.getElementById(watch.product_name);
    var discountProductElement = document.getElementById(`${watch.product_name} product`);
    var discountBrandElement = document.getElementById(`${watch.product_name} brand`);
    var discountImgElement = document.getElementById(`${watch.product_name} image_url`);
    var discountImg2Element = document.getElementById(`${watch.product_name} image_url2`);
    var discountImg3Element = document.getElementById(`${watch.product_name} image_url3`);
    var discountPriceElement = document.getElementById(`${watch.product_name} price`);
    var discountDeleteElement = document.getElementById(`${watch.product_name} delete`);

    let elements = [];
    elements.push(discountProductElement);
    elements.push(discountBrandElement);
    elements.push(discountImgElement);
    elements.push(discountImg2Element);
    elements.push(discountImg3Element);
    elements.push(discountPriceElement);

    let discountType = []

    if (discountElement.innerHTML === "Save") {
      discountElement.innerHTML = "Edit";      
      discountDeleteElement.style.display = 'none';

      discountType.push(discountProductElement.children[0].value);
      discountType.push(discountBrandElement.children[0].value);
      discountType.push("...");
      discountType.push("...");
      discountType.push("...");
      discountType.push(discountPriceElement.children[0].value);
      discountType.push(discountImgElement.children[0].value);
      discountType.push(discountImg2Element.children[0].value);
      discountType.push(discountImg3Element.children[0].value);


      for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = discountType[i];
      }

      elements[2].title = discountType[6];
      elements[3].title = discountType[7];
      elements[4].title = discountType[8];

      // save changes
      try {
        var discount = {save_watch_changes: "True", product_name: discountType[0], brand: discountType[1], image_url: discountType[6], image_url_2: discountType[7], image_url_3: discountType[8], price: discountType[5]}
        const queryParams = new URLSearchParams(discount).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }catch (error) {
        console.error('Error fetching data:', error);
      }

      setDisplayTitle("Edit Watches");

    }else{
      discountElement.innerHTML = "Save";
      discountDeleteElement.style.display = 'block';
      discountType.push(watch.product_name);
      discountType.push(watch.brand_name);
      discountType.push(watch.image_url);
      discountType.push(watch.image_url_2);
      discountType.push(watch.image_url_3);
      discountType.push(watch.price);

      for (let i = 0; i < elements.length; i++) {
        var inputElement = document.createElement("input");
    
        inputElement.type = "text";
        inputElement.value = discountType[i];
        //inputElement.style.width = '150px';
        inputElement.classList.add('admin-panel-details-table-watches-input');
        elements[i].innerHTML = "";
        elements[i].appendChild(inputElement);
      }
    }
  }

  const addNewSale = async () => {
    var banner_url = document.getElementById("new_sale_banner_url").value
    var sale_amount = document.getElementById("new_sale_amount").value
    var sale_start_date = document.getElementById("new_sale_start_date").value
    var sale_end_date = document.getElementById("new_sale_end_date").value

    sale_start_date = "2024-" + sale_start_date;
    sale_end_date = "2024-" + sale_end_date;

    try {
      var sale = {add_sale: "True", banner_url: banner_url, sale_amount: sale_amount, start_date: sale_start_date, end_date: sale_end_date}
      const queryParams = new URLSearchParams(sale).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      window.location.reload();

    }catch (error) {
      console.error('Error fetching data:', error);
    }    
  }

  const editSale = async (sale) => {
    var saleElement = document.getElementById(sale.id);
    var saleImgElement = document.getElementById(`${sale.id} banner url`);
    var saleAmountElement = document.getElementById(`${sale.id} amount`);
    var saleStartDateElement = document.getElementById(`${sale.id} start date`);
    var saleEndDateElement = document.getElementById(`${sale.id} end date`);
    var saleDeleteElement = document.getElementById(`${sale.id} delete`);

    let elements = [];
    elements.push(saleImgElement);
    elements.push(saleAmountElement);
    elements.push(saleStartDateElement);
    elements.push(saleEndDateElement);

    let discountType = []

    if (saleElement.innerHTML === "Save") {
      saleElement.innerHTML = "Edit";      
      saleDeleteElement.style.display = 'none';

      discountType.push("...");
      discountType.push(saleAmountElement.children[0].value);
      discountType.push(saleStartDateElement.children[0].value);
      discountType.push(saleEndDateElement.children[0].value);
      discountType.push(saleImgElement.children[0].value);

      for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = discountType[i];
      }

      elements[0].title = discountType[4];

      // save changes
      try {
        var sale = {save_sale_changes: "True", sale_id: sale.id, banner_url: discountType[4], sale_amount: discountType[1], start_date: discountType[2], end_date: discountType[3]}
        const queryParams = new URLSearchParams(sale).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }catch (error) {
        console.error('Error fetching data:', error);
      }

      setDisplayTitle("Edit Sales");

    }else{
      saleElement.innerHTML = "Save";
      saleDeleteElement.style.display = 'block';
      discountType.push(sale.sale_banner_url);
      discountType.push(sale.sale_amount);
      discountType.push(new Date(sale.sale_start_date).toISOString().split('T')[0]);
      discountType.push(new Date(sale.sale_end_date).toISOString().split('T')[0]);

      for (let i = 0; i < elements.length; i++) {
        var inputElement = document.createElement("input");
    
        inputElement.type = "text";
        inputElement.value = discountType[i];
        //inputElement.style.width = '150px';
        inputElement.classList.add('admin-panel-details-table-watches-input');
        elements[i].innerHTML = "";
        elements[i].appendChild(inputElement);
      }
    }

  }

  const deleteSale = async (sale) => {
    try {
      const sale_to_delete = { delete_sale: sale.id };
      const queryParams = new URLSearchParams(sale_to_delete).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    }catch (error) {
      console.error('Error fetching data:', error);
    }
    setDisplayTitle("Edit Sales");
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        document.getElementById('searchInput').focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const editUser = async (user) => {
    var userElement = document.getElementById(user.id);
    var usernameElement = document.getElementById(`${user.id} username`);
    var userSuspendedUntilElement = document.getElementById(`${user.id} suspended until`);
    var userBanElement = document.getElementById(`${user.id} ban`);
    var userAdminElement = document.getElementById(`${user.id} admin`);
    var userDeleteElement = document.getElementById(`${user.id} delete`);

    let elements = [];
    elements.push(usernameElement);
    elements.push(userSuspendedUntilElement);
    elements.push(userBanElement);
    elements.push(userAdminElement);

    let discountType = []

    if (userElement.innerHTML === "Save") {
      userElement.innerHTML = "Edit";      
      userDeleteElement.style.display = 'none';
      discountType.push(userSuspendedUntilElement.children[0].value ? userSuspendedUntilElement.children[0].value : "none");
      discountType.push(userBanElement.children[0].value);
      discountType.push(userAdminElement.children[0].value);
      console.log()

      for (let i = 0; i < elements.length - 1; i++) {
        elements[i + 1].innerHTML = discountType[i];
      }

      elements[0].title = discountType[4];

      // save changes
      try {
        var user = {save_user_changes: "True", user_id: user.id, user_suspended_until: discountType[0], user_ban: discountType[1], user_admin: discountType[2]}
        const queryParams = new URLSearchParams(user).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }catch (error) {
        console.error('Error fetching data:', error);
      }

      setDisplayTitle("Edit Users");

    }else{
      userElement.innerHTML = "Save";
      userDeleteElement.style.display = 'block';
      discountType.push(user.username);
      discountType.push(user.suspended_date);
      discountType.push(user.ban);
      discountType.push(user.admin);

      for (let i = 0; i < elements.length; i++) {
        if(discountType[i] === user.username){
          continue;
        }

        var inputElement = document.createElement("input");
    
        inputElement.type = "text";
        inputElement.value = discountType[i];
        inputElement.classList.add('admin-panel-details-table-watches-input');
        elements[i].innerHTML = "";
        if(discountType[i] === user.suspended_date){
          inputElement.placeholder = "DD-MM-YYYY";
          inputElement.title = "DD-MM-YYYY";
        }
        elements[i].appendChild(inputElement);
      }
    }
  }

  const deleteUser = async (user) => {
    try {
      const user_to_delete = { delete_user: user.id };
      const queryParams = new URLSearchParams(user_to_delete).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    }catch (error) {
      console.error('Error fetching data:', error);
    }
    setDisplayTitle("Edit Users");
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        document.getElementById('searchInput').focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleFind = () => {
    const searchText = searchQuery.trim();
    if (searchText) {
      const result = window.find(searchText, false, false, true, false, false, false);
      if (result) {
        const table = document.querySelector('.scrollable-table');
        if (table) {
          const rows = table.querySelectorAll('tr');
          let found = false;
          rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell) => {
              const text = cell.textContent;
              if (text.includes(searchText)) {
                found = true;
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const startIndex = text.indexOf(searchText);
                const endIndex = startIndex + searchText.length;
                const highlightedText = `<mark>${text.substring(startIndex, endIndex)}</mark>`;
                const newText = text.substring(0, startIndex) + highlightedText + text.substring(endIndex);
                cell.innerHTML = newText;
              }
            });
          });
          if (!found) {
            alert('Text not found');
          }
        }
      }
    }
  };    

  return (
    <main style={{width: '100%'}}>
      <div className='admin-panel-grid-container'>
        <div className='sidebar'>
          <div className='admin-panel-container'>
            <button onClick={() => setDisplayTitle("Edit Watches")}>Edit Watches</button>
            <button onClick={() => setDisplayTitle("Add a New Watch")}>Add a New Watch</button>
            <button onClick={() => setDisplayTitle("Edit Discounts")}>Edit Discounts</button>
            <button onClick={() => setDisplayTitle("Add a New Discounts")}>Add a New Discount</button>
            <button onClick={() => setDisplayTitle("Edit Sales")}>Edit Sales</button>
            <button onClick={() => setDisplayTitle("Add a New Sale")}>Add a New Sale</button>
            <button onClick={() => setDisplayTitle("Edit Users")}>Edit Users</button>
          </div>
        </div>
        <div className='item1'>
          <div className='admin-panel-details'>
            <h1><u>{ title }</u></h1>            
            {title === "Edit Watches" && (
              <div className="scrollable-table">
                <input
                  id="searchInput"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFind();
                    }
                  }}
                />
                <table style={{margin: 'auto 20px'}}>
                  <tr>
                    <th>Product Name</th>
                    <th>Brand</th>
                    <th>Main Image Url</th>
                    <th>Image Url 2</th>
                    <th>Image Url 3</th>
                    <th>Price (£)</th>
                  </tr>
                  {watches.map((watch) => (
                    <tr key={watch.product_name}>
                      <td id={`${watch.product_name} product`}>{watch.product_name}</td>
                      <td id={`${watch.product_name} brand`}>{watch.brand_name}</td>
                      <td id={`${watch.product_name} image_url`} title={watch.image_url}>...</td>
                      <td id={`${watch.product_name} image_url2`} title={watch.image_url_2}>...</td>
                      <td id={`${watch.product_name} image_url3`} title={watch.image_url_3}>...</td>
                      <td id={`${watch.product_name} price`}>{watch.price}</td>
                      <button className='admin-panel-details-button' onClick={() => editWatch(watch)} style={{ marginLeft: '10px'}} id={watch.product_name}>Edit</button>
                      <button className='admin-panel-details-button' onClick={() => deleteWatch(watch)} style={{ color: 'red', display: 'none', marginLeft: '10px'}} id={`${watch.product_name} delete`}>Delete</button>
                    </tr>
                  ))}
                </table>
              </div>
            )}
            {title === "Add a New Watch" && (
              <>
                <input className='admin-panel-details-text-input' placeholder='Brand' id="brand_name" />
                <input className='admin-panel-details-text-input' placeholder='Product Name' id="product_name" />
                <input className='admin-panel-details-text-input' placeholder='Main Image Url'id="image_url" />
                <input className='admin-panel-details-text-input' placeholder='Image Url 2'id="image_url2" />
                <input className='admin-panel-details-text-input' placeholder='Image Url 3'id="image_url3" />
                <input className='admin-panel-details-text-input' placeholder='Price' id="price" />
                <button className='admin-panel-details-text-input' onClick={() => addNewWatch()} style={{backgroundColor: '#13204b'}}>Add New Watch</button>
              </>
            )}
            {title === "Edit Discounts" && (
              <div className="scrollable-table-2">
                <input
                  id="searchInput"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFind();
                    }
                  }}
                />
                <table style={{margin: 'auto'}}>
                  <tr>
                    <th>Discount Code</th>
                    <th>Discount Amount (%)</th>
                    <th>End Date</th>
                  </tr>
                  {discounts.map((discount) => (
                    <tr key={discount.discount_code}>
                      <td>{discount.discount_code}</td>
                      <td id={`${discount.discount_code} amount`}>{discount.discount_amount}</td>
                      <td id={`${discount.discount_code} date`}>{new Date(discount.end_date).toISOString().split('T')[0]}</td>
                      <button className='admin-panel-details-button' onClick={() => editDiscount(discount)} style={{ marginLeft: '10px'}} id={discount.discount_code}>Edit</button>
                      <button className='admin-panel-details-button' onClick={() => deleteDiscount(discount)} style={{ color: 'red', display: 'none', marginLeft: '10px'}} id={`${discount.discount_code} delete`}>Delete</button>
                    </tr>
                  ))}
                </table>
              </div>
            )}
            {title === "Add a New Discounts" && (
              <>
                <input className='admin-panel-details-text-input' placeholder='Discount Code' id="new_discount_code" />
                <input className='admin-panel-details-text-input' placeholder='Discount Percentage Amount'id="new_discount_amount" />
                <input className='admin-panel-details-text-input' placeholder='End Date (YYYY-MM-DD)' id="new_discount_end_date" />
                <button className='admin-panel-details-text-input' onClick={() => addNewDiscount()} style={{backgroundColor: '#13204b'}}>Add New Discount</button>
              </>
            )}
            {title === "Edit Sales" && (
              <div className="scrollable-table-2">
                <input
                  id="searchInput"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFind();
                    }
                  }}
                />
                <table style={{margin: 'auto'}}>
                  <tr>
                    <th>Sale Banner URL</th>
                    <th>Discount Amount (%)</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td id={`${sale.id} banner url`} title={sale.sale_banner_url}>...</td>
                      <td id={`${sale.id} amount`}>{sale.sale_amount}</td>                      
                      <td id={`${sale.id} start date`}>{new Date(sale.sale_start_date).toISOString().split('T')[0]}</td>
                      <td id={`${sale.id} end date`}>{new Date(sale.sale_end_date).toISOString().split('T')[0]}</td>
                      <button className='admin-panel-details-button' onClick={() => editSale(sale)} style={{ marginLeft: '10px'}} id={sale.id}>Edit</button>
                      <button className='admin-panel-details-button' onClick={() => deleteSale(sale)} style={{ color: 'red', display: 'none', marginLeft: '10px'}} id={`${sale.id} delete`}>Delete</button>
                    </tr>
                  ))}
                </table>
              </div>
            )}
            {title === "Add a New Sale" && (
              <>
                <input className='admin-panel-details-text-input' placeholder='Banner URL' id="new_sale_banner_url" />
                <input className='admin-panel-details-text-input' placeholder='Discount Percentage Amount'id="new_sale_amount" />
                <input className='admin-panel-details-text-input' placeholder='Start Date (MM-DD)' id="new_sale_start_date" />
                <input className='admin-panel-details-text-input' placeholder='End Date (MM-DD)' id="new_sale_end_date" />
                <button className='admin-panel-details-text-input' onClick={() => addNewSale()} style={{backgroundColor: '#13204b'}}>Add New Sale</button>
              </>
            )}
            {title === "Edit Users" && (
              <div className="scrollable-table-2">
                <input
                  id="searchInput"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFind();
                    }
                  }}
                />
                <table style={{margin: 'auto'}}>
                  <tr>
                    <th>Username</th>
                    <th>Suspended Until</th>
                    <th>Ban</th>
                    <th>Admin</th>
                  </tr>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td id={`${user.id} username`}>{user.username}</td>
                      <td id={`${user.id} suspended until`}>{user.suspended_date}</td>                      
                      <td id={`${user.id} ban`}>{user.ban}</td>
                      <td id={`${user.id} admin`}>{user.admin ? 'true' : 'false'}</td>
                      <button className='admin-panel-details-button' onClick={() => editUser(user)} style={{ marginLeft: '10px'}} id={user.id}>Edit</button>
                      <button className='admin-panel-details-button' onClick={() => deleteUser(user)} style={{ color: 'red', display: 'none', marginLeft: '10px'}} id={`${user.id} delete`}>Delete</button>
                    </tr>
                  ))}
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoadPage;
