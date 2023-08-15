import React, { FunctionComponent } from "react"
import { ButtonProps } from "./types"

const Button: FunctionComponent<ButtonProps> = ({ text, callback, cssType }) => {
    return (<button className={cssType} onClick={(event) => {
        event.preventDefault()
        callback()
    }}>{text}</button>)
}

export default Button