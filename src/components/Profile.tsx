import { useDispatch, useSelector } from "react-redux"
import { AuthInitialStore, CHANGE_AUTH } from "../store/store"

const Profile = () => {

    const isAuth = useSelector((state: any) => state.auth.isAuth)

    const dispatch = useDispatch()

    return (<>
        <div>{isAuth ? 'Вы вошли в профиль' : 'Чтобы войти в профиль нажмите кнопку ниже'}</div>
        <button style={{ marginTop: 10 }} onClick={() => {
            dispatch({ type: CHANGE_AUTH })
        }}>{isAuth ? 'Выйти' : 'Войти'}</button>
    </>)
}

export default Profile