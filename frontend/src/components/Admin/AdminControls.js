import React, { useState, useEffect } from 'react';
import { fetchData, postData } from '../../services/apiService';
import './css/AdminControls.css';

const AdminControls = () => {
    const [temperature, setTemperature] = useState(25);
    const [moneyCollected, setMoneyCollected] = useState(0);
    const [token, setToken] = useState(null);

    const [adminProducts, setAdminProducts] = useState({
        'Water': { name: 'Water', price: null, quantity: 0 },
        'Soda': { name: 'Soda', price: null, quantity: 0 },
        'Coke': { name: 'Coke', price: null, quantity: 0 },
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
        }
    }, []);

    const collectMoney = async () => {
        try {
            const response = await postData('admin/collect-money', null, token);

            if (response.status === 200) {
                const data = await response.json();
                setMoneyCollected(data.balance);
                alert(`You've collected money`);
            } else {
                throw new Error("Unexpected response status: " + response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const resetVendingMachine = async () => {
        try {
            const response = await postData('admin/reset', null, token);

            if (response.status === 200) {
                alert(`You've reset vending machine`);
            } else {
                throw new Error("Unexpected response status: " + response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSetTemperature = async () => {
        try {
            const body = { 'degree': temperature }
            const response = await postData('admin/adjust-temperature', body, token);

            if (response.status === 200) {
                alert(`You've adjusted temperature`);
            } else {
                throw new Error("Unexpected response status: " + response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const updateProductPrice = async (productName, newPrice) => {
        try {
            const body = { 'name': productName, 'price': newPrice }
            const response = await postData('admin/update-price', body, token);

            if (response.status === 200) {
                alert(`You've updated price of ${productName}`);
            } else {
                throw new Error("Unexpected response status: " + response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateProductQuantity = async (productName, quantityToAdd) => {
        try {
            const productObjects = [];

            for (let i = 0; i < quantityToAdd; i++) {
                let randomBool = Math.random() > 0.8;
                const product = {
                    name: productName,
                    fake: randomBool,
                };
                productObjects.push(product);
            }
            console.log(productObjects);
            const body = { 'productDtos': productObjects }
            const response = await postData('admin/add-products', body, token);

            if (response.status === 200) {
                const data = await response.json();
                console.log(data);
                alert(`You've added ${data.realProductCount} real products. Other ${data.fakeProductCount} products were fake`);
            } else {
                throw new Error("Unexpected response status: " + response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePriceChange = (productName, newPrice) => {
        setAdminProducts({
            ...adminProducts,
            [productName]: {
                ...adminProducts[productName],
                price: newPrice,
            },
        });
    };

    const handleQuantityChange = (productName, newQuantity) => {
        setAdminProducts({
            ...adminProducts,
            [productName]: {
                ...adminProducts[productName],
                quantity: newQuantity,
            },
        });
    };


    const renderProductControls = (adminProducts, changeHandler, actionHandler, actionLabel, buttonLabel) => {
        return (
            <div className="product-prices">
                {Object.keys(adminProducts).map((productName) => (
                    <div key={productName} className="product-price">
                        <span>{productName}:</span>
                        <input
                            type="number"
                            value={adminProducts[productName][actionLabel.toLowerCase()] < 0 ? 0 : adminProducts[productName][actionLabel.toLowerCase()]}
                            onChange={(e) => changeHandler(productName, e.target.value)}
                        />
                        <button onClick={() => actionHandler(productName, adminProducts[productName][actionLabel.toLowerCase()])}>
                            {buttonLabel}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    useEffect(() => {
        async function fetchProductData() {

            const response = await fetchData('products');
            const data = await response.json();

            const updatedAdminProducts = { ...adminProducts };
            data.productDtos.forEach((item) => {
                const { name, price } = item;
                if (adminProducts.hasOwnProperty(name)) {
                    updatedAdminProducts[name].price = price;
                }
            });
            console.log(data.productDtos);
            setAdminProducts(updatedAdminProducts)
        }

        fetchProductData();
    }, []);

    useEffect(() => {
        async function fetchVendingMachineData() {

            const response = await fetchData('vending-machine');
            const data = await response.json();
            setTemperature(data.temperature);
        }

        fetchVendingMachineData();
    }, []);

    return (
        <div className="admin-box">
            <h3>Admin Controls</h3>
            <button onClick={resetVendingMachine}>Reset Vending Machine</button>
            <button class="button button2" onClick={collectMoney}>Collect Money</button>
            <div className="admin-balance">
                Balance: {moneyCollected}tl
            </div>
            <div>
                <label>Set Temperature: </label>
                <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                />
                <span>°C</span>
                <button
                    onClick={() =>
                        handleSetTemperature()
                    }
                >
                    Update
                </button>
            </div>
            <div>
                <div className="product-prices">
                    <div>
                        <div style={{ marginTop: 10 }}>Product Prices:</div>
                        {renderProductControls(adminProducts, handlePriceChange, updateProductPrice, 'price', 'Update')}
                        <div style={{ marginTop: 10 }}>Add Products:</div>
                        {renderProductControls(adminProducts, handleQuantityChange, updateProductQuantity, 'quantity','Add')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminControls;