import React, { useEffect } from 'react';
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
import { GlobalStore, StorePost } from './store/types';
import EditProfileInfo from './components/EditProfileInfo';
import CreateOrEditPost from './components/CreatePostOrEdit';
import PostPage from './components/PostPage';
import { getPosts } from './firebase/firestore';
import { EDIT_NEWS, EDIT_NEWS_LOADING } from './store/consts';
import { store } from './store/store';

const App = () => {

  const isAuth = useSelector((state: GlobalStore) => state.auth.isAuth)
  // console.log(isAuth)
  // test()

  useEffect(() => {

    getPosts().then((res) => {
      let newPosts: StorePost[] | [] = []
      res.forEach((post: any) => {
        newPosts = [...newPosts, { ...post.data(), id: post.id }]
      })
      store.dispatch({ type: EDIT_NEWS, editNews: newPosts })
      store.dispatch({ type: EDIT_NEWS_LOADING })
    }).catch((err) => {
      console.log(err)
    })

    console.log('News Mount')

  }, [])


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index={true} element={<Main />} />
          <Route path='news' element={<><Outlet /></>}>
            <Route index={true} element={<News />} />
            <Route path=':postId' element={<PostPage />} />
          </Route>
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
