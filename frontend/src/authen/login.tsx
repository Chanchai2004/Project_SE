import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { authenticateUser } from '../services/https/index';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await authenticateUser(username, password);

      if (response) {
        // เก็บ token, username, position และ id ลงใน cookies
        Cookies.set("authToken", response.token, { expires: 1 }); // เก็บ token ไว้ 1 วัน
        Cookies.set("username", response.username, { expires: 1 });
        Cookies.set("position", response.position, { expires: 1 });
        Cookies.set("id", response.id.toString(), { expires: 1 });

        // ตรวจสอบตำแหน่งงาน (position)
        if (response.position === 'Doctor') {
          navigate('/doctor1'); // เปลี่ยนเส้นทางไปที่ /doctor ถ้า position เป็น Doctor
        } else {
          alert('Login successful, but position is not Doctor.');
        }
      } else {
        alert('Authentication failed. Please check your username and password.');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
