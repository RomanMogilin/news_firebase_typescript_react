import React from "react"
import { useNavigate } from "react-router-dom"

const Profile = () => {

    let navigate = useNavigate()

    return (<React.Fragment>
        <button onClick={(event) => {
            event.preventDefault()
            navigate('/profile/sign-up')
        }}>Зарегестрироваться</button>
        <button onClick={(event) => {
            event.preventDefault()
            navigate('/profile/sign-in')
        }}>Войти</button>
    </React.Fragment>)
}

export default Profile