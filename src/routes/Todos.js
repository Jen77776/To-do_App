import React, { useState, useEffect } from 'react';
import TodoItem from '../common/TodoItem'; // 根据实际位置调整
import { useParams, useNavigate, Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css';
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [userId, setUserId] = useState(null);  // 新增 userId 状态
  const navigate = useNavigate();
  const { category } = useParams();
  //用于检查用户是否登录的函数
  const checkLoggedIn = async () => {
    try {
      // 向/.auth/me发送请求以获取当前用户的登录状态
      const response = await fetch('/.auth/me');
      const data = await response.json();
  
      // 检查返回的数据中是否有用户信息
      if (!data.clientPrincipal) {
        // 如果没有用户信息，则视为未登录，重定向到根路径'/'
        console.log(11111);
        navigate('/');
      }

      // 如果有用户信息，则视为已登录，无需操作
    } catch (error) {
      // 如果请求失败，可以根据实际情况处理错误，例如显示错误信息或重定向
      console.error("Failed to check login status:", error);
      navigate('/');
    }
  };
  

  // 在组件加载时获取待办事项和类别列表
  useEffect(() => {
    checkLoggedIn();
    async function fetchData() {
      try {
        const response = await fetch('/.auth/me');
        const data = await response.json();
  
        if (!data.clientPrincipal) {
          console.log(11111);
          navigate('/');
          return; // 如果未登录，直接返回
        }
  
        setUserId(data.clientPrincipal.userId);
        console.log("this is Userid:", data.clientPrincipal.userId);
        const todosResp = await fetch("/api/todo");
        const todosData = await todosResp.json();
        setTodos(todosData.data || []);
        const userTodos = todosData.data.filter(todo => todo.userId === data.clientPrincipal.userId);
        const reversedTodos = userTodos.reverse();
        setTodos(reversedTodos);

        const categoriesResp = await fetch("/api/categories");
        const categoriesData = await categoriesResp.json();
        console.log("获取的类别数据:", categoriesData); // 打印原始类别数据
        setCategories(categoriesData.categories || []);
  
      } catch (error) {
        console.error("Failed to check login status:", error);
        navigate('/');
      }
    }
  
    fetchData();
  }, [navigate]);

  async function addTodo() {
    if (!userId) {
      alert("User not logged in.");
      return;
    }
    // 创建新待办事项逻辑...
    const newTodo = {

      title: newTodoContent, // Assuming you only have a title, no description
      description: "", // You can add an input for users to enter a description, or leave it empty
      completed: false, // New todos are not completed by default
      category: "",
      userId: userId
    };
    
    const result = await fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo)
    });

    if (result.ok) {
      const addedTodo = await result.json();
      // Update the state to include the new todo item
      setTodos(prevTodos => [addedTodo, ...prevTodos]);
      // Clear the input after adding the todo
      setNewTodoContent("");
    }
  }

  async function addCategory() {
    // 检查类别名称是否为空
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }
  
    const response = await fetch('/api/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryName: newCategoryName.trim() }),
    });
  
    if (response.ok) {
      const addedCategory = await response.json();
      setCategories([...categories, addedCategory.name]); // 这里你可能需要调整以匹配你的数据结构
      setNewCategoryName('');
    } else {
      const error = await response.json();
      alert(error.error || "Failed to add category.");
    }
  }
  

  async function deleteCategory(categoryName) {
    const response = await fetch(`/api/category/${categoryName}`, { method: 'DELETE' });
    if (response.ok) {
      setCategories(categories.filter(name => name !== categoryName));
    } else {
      alert("Failed to delete category.");
    }
  }
  // 定义handleLogout函数
  const handleLogout = () => {
    const logoutUrl = `${window.location.origin}/.auth/logout`;
    window.location.href = logoutUrl;
  };
  // 获取特定ID的待办事项的完整数据
const getTodoById = (todoId) => {
  return todos.find(todo => todo._id === todoId);
};

const completeTodo = async (todoId) => {
  const todoToUpdate = getTodoById(todoId);

  // 确保找到了待办事项
  if (!todoToUpdate) {
    alert("Todo not found!");
    return;
  }

  // 更新待办事项的完成状态
  const updatedTodo = { ...todoToUpdate, completed: true };

  const response = await fetch(`/api/todo/${todoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTodo) // 发送更新后的待办事项
  });

  if (response.ok) {
    // 如果成功，更新前端的状态
    setTodos(todos.map(todo => todo._id === todoId ? updatedTodo : todo));
    alert("Todo marked as completed!");
  } else {
    // 错误处理
    alert("Failed to complete the todo.");
  }
};

  const deleteTodo = async (todoId) => {
    const response = await fetch(`/api/todo/${todoId}`, {
      method: 'DELETE'
    });
  
    if (response.ok) {
      // 从状态中移除已删除的待办事项
      setTodos(todos.filter(todo => todo._id !== todoId));
    } else {
      // 错误处理，比如显示错误消息
      alert("Failed to delete the todo.");
    }
  };
  
  
  
  return (
    <section className="section">
    <div className="container">
      <div className="buttons">
        <Link className="button is-info is-light" to="/">Go Home</Link>
        <Link className="button is-info is-light" to="/done">Completed Todos</Link>
        <button className="button is-danger is-light" onClick={handleLogout}>Log Out</button>
      </div>
      
      <h1 className="title">Todo List {category ? `for ${category}` : ''}</h1>
      <div className="box">
        {todos.filter(todo => !todo.completed && (!category || todo.category === category)).map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onComplete={completeTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
      <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input is-info"
              type="text"
              value={newTodoContent}
              onChange={(e) => setNewTodoContent(e.target.value)}
              placeholder="Enter new todo title"
            />
          </div>
          <div className="control">
            <button className="button is-success" onClick={addTodo}>
              Add Todo
            </button>
          </div>
        </div>
      
      
      <article className="panel is-info">
        <p className="panel-heading">
          Categories
        </p>
        <div className="panel-block">
          <div className="tags are-medium">
            {categories.map((categoryName, index) => (
               <span className="tag is-link" key={index} style={{ backgroundColor: '#3273dc', color: 'white' }}> {/* 更深的蓝色背景与白色字体 */}
               <Link to={`/todos/${categoryName}`} style={{ color: 'white' }}> {/* 确保链接颜色也是白色 */}
                 {categoryName}
               </Link>
               <button className="delete is-small" onClick={() => deleteCategory(categoryName)}></button>
             </span>
            ))}
          </div>
        </div>
        <div className="panel-block">
          <div className="field has-addons">
            <div className="control is-expanded">
              <input className="input is-info" type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" />
            </div>
            <div className="control">
              <button className="button is-success" onClick={addCategory}>Add Category</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
  
  );
}

export default TodoList;
