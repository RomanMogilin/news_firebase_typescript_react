import { useDispatch, useSelector } from "react-redux";
import { GlobalStore } from "../store/types";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EDIT_USER_DESCRIPTION, EDIT_USER_NAME, EDIT_USER_PROFILE_PHOTO } from "../store/consts";
import { updateFirestoreCollectionField } from "../firebase/firestore";
import { Dispatch } from "redux";
import { addImg, getImg } from "../firebase/init";

const EditProfileInfo = () => {

    const userName = useSelector((state: GlobalStore) => state.user.userName);
    const profilePhoto = useSelector((state: GlobalStore) => state.user.profilePhoto);
    const description = useSelector((state: GlobalStore) => state.user.description);
    const userUid = useSelector((state: GlobalStore) => state.auth.userUid);
    const dateOfRegistration = useSelector((state: GlobalStore) => state.user.dateOfRegistration);

    const inputUserNameRef = useRef<HTMLInputElement>(null);
    const inputProfilePfotoRef = useRef<HTMLInputElement>(null);
    const inputDescriptionRef = useRef<HTMLInputElement>(null);
    const dispatch: Dispatch = useDispatch();
    const navigate = useNavigate();

    const [canSubmit, changeCanSubmit] = useState<boolean>(true);

    const ChangeUserDataOnSubmit = (event: any) => {
        event.preventDefault();
        if (inputUserNameRef.current && inputDescriptionRef.current && canSubmit) {
            updateFirestoreCollectionField('users', userUid, {
                userName: inputUserNameRef.current.value,
                description: inputDescriptionRef.current.value,
            })
            dispatch({ type: EDIT_USER_NAME, editUserName: inputUserNameRef.current.value })
            dispatch({ type: EDIT_USER_DESCRIPTION, editUserDescription: inputDescriptionRef.current.value })
            navigate('/profile/dashboard')
        }
    }

    return (<>
        <div>Настройки профиля:</div>
        <form onSubmit={(event) => {
            event.preventDefault();
            if (inputProfilePfotoRef.current?.files) {
                changeCanSubmit(false)
                console.log(inputProfilePfotoRef.current.files[0])
                console.log(inputProfilePfotoRef.current.value)
                console.log(`${userUid}_img_${dateOfRegistration}`)
                addImg(`${userUid}_img_${dateOfRegistration}`, inputProfilePfotoRef.current.files[0], userUid, 'users').then((res) => {

                    dispatch({ type: EDIT_USER_PROFILE_PHOTO, editUserProfilePhoto: res })
                    updateFirestoreCollectionField('users', userUid, {
                        profilePhoto: res
                    })
                    changeCanSubmit(true)
                }).catch(() => changeCanSubmit(true))
            }
        }}>
            <input type="file" ref={inputProfilePfotoRef}></input>
            <button type="submit">загрузить фото</button>
        </form>

        <form onSubmit={(event) => ChangeUserDataOnSubmit(event)}>
            {/* <div>ProfilePhoto:</div>
            <input ref={inputProfilePfotoRef} type="text" defaultValue={profilePhoto}></input> */}
            <div>Nickname:</div>
            <input ref={inputUserNameRef} type="text" defaultValue={userName}></input>
            <div>Nickname:</div>
            <input ref={inputDescriptionRef} type="text" defaultValue={description}></input>
            <button type="submit">Сохранить</button>
        </form>
    </>)
}

export default EditProfileInfo