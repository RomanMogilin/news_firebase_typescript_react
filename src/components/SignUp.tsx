import { useNavigate } from "react-router-dom"
import { signUp } from "../firebase/functions"
import React, { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { GlobalStore } from '../store/types';

/**
 * @description Создание аккаунта для новых пользователей
 * @returns TSX разметку страницы <Создания аккаунта>
 */
const SignUp = () => {

    let navigate = useNavigate()
    const isAuth = useSelector((state: GlobalStore) => state.auth.isAuth)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        isAuth && navigate('/profile/dashboard')
    })

    return (<React.Fragment>
        <div>Создание аккаунта:</div>
        <form onSubmit={(event) => {
            event.preventDefault()
            console.log(`email: ${emailRef.current?.value}, password: ${passwordRef.current?.value}`)
            emailRef.current && passwordRef.current && signUp(emailRef.current.value, passwordRef.current.value)
        }}>
            <div className="header">Почта:</div>
            <input className="form_input" ref={emailRef} placeholder="Введите почту..."></input>
            <div className="header">Пароль:</div>
            <input className="form_input" ref={passwordRef} placeholder="Введите пароль..."></input>
            <button className="form_button" type="submit">Зарегестрироваться</button>
        </form>
        <button onClick={(event) => {
            event.preventDefault()
            navigate('/profile')
        }}>Вернуться обратно</button>
    </React.Fragment>)
}

export default SignUp