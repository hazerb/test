import React, { useState, useEffect } from 'react';
import { fetchData, postData } from '../../services/apiService';
import './css/VendingMachine.css';


const VendingMachine = () => {
  const [insertedMoney, setInsertedMoney] = useState(null);
  const [change, setChange] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vendingMachineTemperature, setVendingMachineTemperature] = useState(null);


  const [products, setProducts] = useState({
    'Water': { name: 'Water', price: null, quantity: null },
    'Soda': { name: 'Soda', price: null, quantity: null },
    'Coke': { name: 'Coke', price: null, quantity: null },
  });

  const handleInsertMoney = (amount) => {
    const randomBool = Math.random() > 0.8;
    const moneyDto = { amount: amount, fake: randomBool };

    postData('insert-money', moneyDto)
      .then((response) => {
        if (response.status === 200) {
          setInsertedMoney(insertedMoney + amount);
        } else if (response.status === 400) {
          alert("fake money")
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handlePurchase = async () => {
    if (selectedProduct && insertedMoney >= selectedProduct.price) {
      try {
        const productRequest = { name: selectedProduct.name };
        const response = await postData('buy-product', productRequest);

        if (response.status === 200) {
          const data = await response.json();
          setInsertedMoney(0);
          setChange(data.change);
          setSelectedProduct(null);
          const updatedProducts = { ...products };
          updatedProducts[selectedProduct.name].quantity = data.productQuantity;
          alert(`You've purchased ${selectedProduct.name}. Enjoy!`);
        } else if (response.status === 400) {
          alert("No product left of this type or not enough money");
        } else {
          throw new Error("Unexpected response status: " + response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please select a product or insert enough money to purchase the selected product.');
    }
  };

  const handleCancel = async () => {
    try {
      const response = await postData('cancel-request');
      if (response.status === 200) {
        setInsertedMoney(0);
        setSelectedProduct(null);
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    async function fetchDataFromVendingMachine() {
      try {
        const response = await fetchData('vending-machine');
        const data = await response.json();

        setVendingMachineTemperature(data.temperature);
        setInsertedMoney(data.insertedMoney);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchDataFromVendingMachine();
  }, []);

  useEffect(() => {
    function controlTemperature() {
      console.log('Temp is okay');
    }
    controlTemperature();
    const interval = setInterval(controlTemperature, 20 * 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    async function fetchProductData() {
      try {
        const response = await fetchData('products');
        const data = await response.json();

        const updatedProducts = { ...products };

        data.productDtos.forEach((item) => {
          const { name, price, quantity } = item;
          if (updatedProducts.hasOwnProperty(name)) {
            updatedProducts[name].price = price;
            updatedProducts[name].quantity = quantity;
          }
        });

        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchProductData();
  }, []);




  return (
    <div className="container">
      <div className="vending-machine">
        <div>
          <h3>{vendingMachineTemperature}°C</h3>
        </div>
        <h2>Vending Machine</h2>
        <div className="products">
          <h3>Products:</h3>
          <ul>
            {Object.values(products).map((product) => (
              <li key={product.name}>
                <div className="product-price">
                <div className="product-details">
                  <div>{product.name}</div>
                  <div>{product.price}tl</div>
                  </div>
                  <div className="product-quantity">Qty: {product.quantity}</div>
                  {insertedMoney >= product.price && product.quantity > 0 ? <button className="button button3" onClick={() => handleSelectProduct(product)}>Select</button> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {
          <div className="money">
            <div className="header-container">
              <h3>Inserted Money: {insertedMoney}tl</h3>
              <div className="money-container">
                <h3 className="h3 selected-product">Selected Product: {selectedProduct ? selectedProduct.name : ''}</h3>
                <h3>Change: {change}tl</h3>
              </div>
            </div>
            <div className="money-buttons">
              <button className="button button3" onClick={() => handleInsertMoney(1)}>Insert 1tl</button>
              <button className="button button3" onClick={() => handleInsertMoney(5)}>Insert 5tl</button>
              <button className="button button3" onClick={() => handleInsertMoney(10)}>Insert 10tl</button>
              <button className="button button3" onClick={() => handleInsertMoney(20)}>Insert 20tl</button>
              <button onClick={handlePurchase} className="purchase-button">Purchase</button>
              <button onClick={handleCancel} className="purchase-button">Cancel</button>
            </div>
          </div>}
      </div>
    </div>
  );
};

export default VendingMachine;