import React, { useState, useEffect } from 'react';
import TodoItem from '../common/TodoItem'; // Adjust based on actual location
import { useParams, Link } from 'react-router-dom';

function Donecategory() {
  const { category } = useParams();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTodoContent, setNewTodoContent] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/todo");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const filteredTodos = result.data.filter(todo => todo.category === category && todo.completed);
        setTodos(filteredTodos);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [category]); // 依赖数组中包含category，确保当category变化时重新获取数据

  async function addTodo() {
    const newTodo = {
      title: newTodoContent,
      description: "", // 如果需要，可以添加一个输入框让用户输入描述
      completed: false,
      category: category // 确保新添加的待办事项被分配到当前类别
    };

    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo)
      });

      if (response.ok) {
        const addedTodo = await response.json();
        setTodos(todos => [...todos, addedTodo]); // 将新待办事项添加到状态中
        setNewTodoContent(""); // 清空输入框
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to="/">Go Home</Link> | <Link to="/todos">All Todos</Link>
      <h1>Category: {category}</h1>
      {todos.length > 0 ? (
        todos.map(todo => <TodoItem key={todo._id} todo={todo} />) // 使用todo._id作为key
      ) : (
        <p>No todos found in this category.</p>
      )}
      <div>
        <input
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="Enter new todo"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
    </div>
  );
}

export default Donecategory;
