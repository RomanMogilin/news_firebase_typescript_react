import { useDispatch, useSelector } from "react-redux";
import { GlobalStore } from "../store/types";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EDIT_USER_NAME } from "../store/consts";
import { setUserName } from "../firebase/firestore";

const EditProfileInfo = () => {

    const userName = useSelector((state: GlobalStore) => state.user.userName);
    const userUid = useSelector((state: GlobalStore) => state.auth.userUid);

    const inputUserNameRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const ChangeUserDataOnSubmit = (event: any) => {
        event.preventDefault()
        if (inputUserNameRef.current) {
            setUserName(userUid, inputUserNameRef.current.value)
            dispatch({ type: EDIT_USER_NAME, editUserName: inputUserNameRef.current.value })
            navigate('/profile/dashboard')
        }
    }

    return (<>
        <div>Настройки профиля:</div>
        <form onSubmit={(event) => ChangeUserDataOnSubmit(event)}>
            <div>Nickname:</div>
            <input ref={inputUserNameRef} type="text" defaultValue={userName}></input>
            <button type="submit">Сохранить</button>
        </form>
    </>)
}

export default EditProfileInfo