import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bulma/css/bulma.min.css'; // 确保已正确引入Bulma
function Home() {
  let navigate = useNavigate();

  useEffect(() => {
    // 假设 fetchUser是一个函数，用于检查用户的登录状态
    // 这可能需要您通过调用特定的API来实现
    const fetchUser = async () => {
      try {
        const response = await fetch('/.auth/me');
        const data = await response.json();
        if (data.clientPrincipal) {
          // 如果用户已经登录，重定向到/todos页面
          navigate('/todos');
        }
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogin = () => {
    const authUrl = `${window.location.origin}/.auth/login/github`;
    window.location.href = authUrl;
  };


  return (
    <section className="hero is-primary is-fullheight-with-navbar">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title">
            To-Do App
          </h1>
          <button className="button is-light" onClick={handleLogin}>
            Log In with GitHub
          </button>
        </div>
      </div>
    </section>
  );
}


export default Home;
