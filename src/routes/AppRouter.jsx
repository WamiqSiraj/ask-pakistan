// src/routes/AppRouter.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import ServicesPage from '../pages/ServicesPage';
import NewsPage from '../pages/NewsPage';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'news', element: <NewsPage /> }
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}