import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { AuthInitialStore } from "./store/store";

const Layout = () => {

    const isAuth = useSelector((state: any) => state.auth.isAuth)

    return (<>
        <header>
            <nav>
                <NavLink to={'/'}>Главная</NavLink>
                <NavLink to={'/news'}>Новости</NavLink>
                <NavLink to={'/profile'}>{isAuth ? 'Профиль' : 'Войти'}</NavLink>
            </nav>
        </header>
        <main><Outlet /></main>
        <footer>Нижняя часть сайта</footer>
    </>)
}

export default Layout