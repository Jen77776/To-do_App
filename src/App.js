import React from 'react';
import { RouterProvider, createBrowserRouter , Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import TodoList, { loader as todoListLoader } from './routes/Todos';
import Done from './routes/Done';
import Todo from './routes/Todo';
import NotFound from './routes/NotFound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/todos",
    element: <TodoList />,
    loader: todoListLoader, // 这里使用您的 loader 函数
  },
  // 定义其他路由...
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;