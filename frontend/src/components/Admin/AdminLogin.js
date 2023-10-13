import React, { useState } from 'react';
import './css/AdminLogin.css';
import { postData } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';


const AdminLogin = ({ onAdminLogin }) => {
  const [uuid, setUuid] = useState('');
  const navigate = useNavigate();

  const handleLogin = async() => {
    try{
      const body = { uuid };
      const response = await postData('admin/login', body);
      if(response.status === 200){
        const token = response.headers.get('Authorization');
        localStorage.setItem('token', token);
        onAdminLogin();
        navigate('/admin/dashboard');
      }else{
        alert("Wrong credentials");
        throw new Error("Invalid credentials " + response.status);
      }
    }catch(error){
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <div className="login-input">
        <input className='input2'
          type="text"
          placeholder="UUID"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default AdminLogin;