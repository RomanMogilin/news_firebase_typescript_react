import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import News from './components/News';
import NotFound from './components/NotFound/NotFound';
import Main from './components/Main';
import Profile from './components/Profile/Profile';
import PrivateRoute from './PrivateRoute';
import { useSelector } from 'react-redux';
import Dashboard from './components/Dashboard/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { GlobalStore } from './store/types';
import EditProfileInfo from './components/EditProfileInfo';
import CreateOrEditPost from './components/CreatePostOrEdit';

function App() {

  const isAuth = useSelector((state: GlobalStore) => state.auth.isAuth)
  console.log(isAuth)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index={true} element={<Main />} />
          <Route path='news' element={<News />} />
          <Route path='profile' element={<><Outlet /></>} >
            <Route index={true} element={<PrivateRoute isAuthicated={!isAuth} redirectPath='/profile/dashboard'>
              <Profile />
            </PrivateRoute>} />
            <Route path='sign-in' element={<PrivateRoute isAuthicated={!isAuth} redirectPath='/profile/dashboard'>
              <SignIn />
            </PrivateRoute>} />
            <Route path='sign-up' element={<PrivateRoute isAuthicated={!isAuth} redirectPath='/profile/dashboard'>
              <SignUp />
            </PrivateRoute>} />
            <Route path='dashboard' element={<PrivateRoute isAuthicated={isAuth} redirectPath='/profile' >
              <Outlet />
            </PrivateRoute>}>
              <Route index={true} element={<Dashboard />} />
              <Route path='edit-profile-info' element={<EditProfileInfo />} />
              <Route path='create-post' element={<CreateOrEditPost type='create' />} />
              <Route path='edit-post' element={<CreateOrEditPost type='edit' />} />
            </Route>
          </Route>
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
