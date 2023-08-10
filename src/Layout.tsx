import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { GlobalStore } from './store/types';

const Layout = () => {

    const isAuth = useSelector((state: GlobalStore) => state.auth.isAuth)

    return (<>
        <header>
            <nav>
                <NavLink to={'/'}>Главная</NavLink>
                <NavLink to={'/news'}>Новости</NavLink>
                <NavLink to={isAuth ? '/profile/dashboard' : '/profile'}>{isAuth ? 'Профиль' : 'Войти'}</NavLink>
            </nav>
        </header>
        <main><Outlet /></main>
        <footer>Нижняя часть сайта</footer>
    </>)
}

export default Layout