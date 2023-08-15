import React from "react"
import { useNavigate } from "react-router-dom"
import './profile.css'
import Button from "../../isolatedComponents/Button"

const Profile = () => {

    let navigate = useNavigate()

    return (<React.Fragment>
        <center className="profile">
            <Button
                callback={() => navigate('/profile/sign-up')}
                text="Зарегестрироваться"
            />
            <Button
                callback={() => navigate('/profile/sign-in')}
                text="Войти"
            />
        </center>
    </React.Fragment>)
}

export default Profile