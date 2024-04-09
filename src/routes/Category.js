import React, { useState, useEffect } from 'react';
import TodoItem from '../common/TodoItem'; // 调整为实际位置
import { useParams, Link } from 'react-router-dom';

function Category() {
  const { category } = useParams();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/todo");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json(); // 获取整个响应体
        const todosData = result.data; // 假设待办事项数组位于响应体的`data`属性中
        if (Array.isArray(todosData)) { // 确保todosData是数组
          // 过滤出与当前类别匹配且未完成的待办事项
          const filteredTodos = todosData.filter(todo => todo.category === category && todo.completed === false);
          setTodos(filteredTodos);
        } else {
          console.error("Expected an array of todos, but received:", todosData);
        }
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTodos();
  }, [category]); // 当category变化时重新执行

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to="/">Go Home</Link> | <Link to="/todos">All Todos</Link>
      <h1>Category: {category}</h1>
      {todos.length > 0 ? (
        todos.map(todo => (
          <TodoItem key={todo._id} todo={todo} />
        ))
      ) : (
        <p>No todos found in this category.</p>
      )}
    </div>
  );
}

export default Category;
