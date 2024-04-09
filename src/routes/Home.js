import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  let navigate = useNavigate();

  const handleLogin = () => {
    // 使用window.location.origin获取当前页面的基础URL，然后拼接认证路径
    const authUrl = `${window.location.origin}/.auth/login/github`;
    window.location.href = authUrl;
  };

  return (
    <div className="home">
      <h1>Max's To-Do App</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default Home;
