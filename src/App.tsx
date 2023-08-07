import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import News from './components/News';
import NotFound from './components/NotFound/NotFound';
import Main from './components/Main';
import Profile from './components/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index={true} element={<Main />} />
          <Route path='news' element={<News />} />
          <Route path='profile' element={<Profile />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
