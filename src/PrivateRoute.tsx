import { FunctionComponent, HTMLAttributes, ReactElement } from "react"
import { Navigate } from "react-router-dom"

interface PrivateRouteProps extends HTMLAttributes<HTMLElement> {
    isAuthicated: boolean,
    redirectPath: string,
    children: ReactElement,
}

/**
 * @description Если пользователь аунтефицирован, то данный компонент возращает переданный в него компонент, если это не так то производит **redirect** пользователя на путь указанный в `redirectPath`
 */
const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ isAuthicated, redirectPath, children }) => {
    if (!isAuthicated) {
        return <Navigate to={redirectPath} replace={true} />
    }
    else {
        return children
    }
}

export default PrivateRoute