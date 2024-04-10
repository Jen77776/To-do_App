import React from 'react';
import { RouterProvider, createBrowserRouter , Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
// import TodoList, { loader as todoListLoader } from './routes/Todos';
import TodoList from './routes/Todos';
import Done , { loader as doneLoader }from './routes/Done';
import Todo from './routes/Todo';
import Category from './routes/Category';
import Donecategory from './routes/Donecategory';

import NotFound from './routes/NotFound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/todos",
    element: <TodoList />,
  },
  {
    path: "/todo/:id", // Adding the route for individual todo details
    element: <Todo />, // This route will render the Todo component
  },
  {
    path: "/done", // Adding the route for individual todo details
    element: <Done />, // This route will render the Todo component
    loader: doneLoader, 
  },
  {
    path: "/todos/:category",
    element: <Category />,
  },
  {
    path: "/done/:category",
    element: <Donecategory />,
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