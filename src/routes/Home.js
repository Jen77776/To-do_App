import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  let navigate = useNavigate();

  const handleLogin = () => {
    // 假设登录逻辑已完成，直接跳转到/todos
    navigate('/todos');
  };

  return (
    <div className="home">
      <h1>Max's To-Do App</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default Home;
