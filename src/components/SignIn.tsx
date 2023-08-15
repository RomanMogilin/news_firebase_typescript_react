import React, { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { GlobalStore } from '../store/types';
import Button from "../isolatedComponents/Button";
import { signIn } from "../firebase/authentication";

/**
 * @description Вход для существующих пользователей
 * @returns JSX разметку страницы <Входа в аккаунт>
 */
const SignIn = () => {

    let navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const isAuth = useSelector((state: GlobalStore) => state.auth.isAuth)

    useEffect(() => {
        isAuth && navigate('/profile/dashboard')
    })

    return (<React.Fragment>
        <div className="title">Войти в аккаунт:</div>
        <form onSubmit={(event) => {
            event.preventDefault()
            console.log(`email: ${emailRef.current?.value}, password: ${passwordRef.current?.value}`)
            emailRef.current && passwordRef.current && signIn(emailRef.current.value, passwordRef.current.value)

        }}>
            <div className="header">Почта:</div>
            <input className="form_input" defaultValue={'abc123@gmail.com'} ref={emailRef} placeholder="Введите почту..."></input>
            <div className="header">Пароль:</div>
            <input className="form_input" defaultValue={'654321'} ref={passwordRef} placeholder="Введите пароль..."></input>
            <button className="form_button" type="submit">Войти</button>
        </form>
        <Button
            text="Вернуться обратно"
            callback={() => navigate('/profile')}
        />
    </React.Fragment>)
}

export default SignIn