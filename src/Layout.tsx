import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { GlobalStore } from './store/types';
import React, { useEffect, useState } from "react";
import { Context, createContext } from "vm";
import { CHANGE_DEV_MODE } from "./store/consts";

// const ModeTheme = createContext({ mode: 'development' });

const Layout = () => {

    const isAuth = useSelector((state: GlobalStore) => state.auth.isAuth)
    const devMode = useSelector((state: GlobalStore) => state.dev.devMode)

    const dispatch = useDispatch()
    // const [DevMode, changeDevMode] = useState<'development' | 'production'>()
    // const detectKeyDown = (event: any) => {
    //     console.log(event)
    //     if (event.code === "Space") {
    //         
    //     }
    //     else {
    //         console.log(event)
    //     }
    // }

    // useEffect(() => {
    //     document.addEventListener('keypress', detectKeyDown, true)
    //     console.log('add keypress listener')
    //     return document.removeEventListener('keypress', detectKeyDown, true)
    // }, [])

    useEffect(() => {
        console.log('render')
    })

    return (
        // <ModeTheme.Provider value={DevMode}>
        <React.Fragment>
            <header>
                <nav>
                    <NavLink to={'/'}>Главная</NavLink>
                    <NavLink to={'/news'}>Новости</NavLink>
                    <NavLink to={isAuth ? '/profile/dashboard' : '/profile'}>{isAuth ? 'Профиль' : 'Войти'}</NavLink>
                    {isAuth && (<NavLink to={'/reaction'}>Ваши оценки</NavLink>)}
                </nav>
                <div onClick={(event) => {
                    event.preventDefault();
                    dispatch({ type: CHANGE_DEV_MODE })
                }}>DevMode: {devMode}</div>
            </header>
            <main><Outlet /></main>
            <footer>Нижняя часть сайта</footer>
        </React.Fragment>
        // </ModeTheme.Provider>
    )
}

export default Layout