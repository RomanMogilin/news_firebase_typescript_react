import { useNavigate } from "react-router-dom"
import './notFound.css'

const NotFound = () => {

    let navigate = useNavigate()

    return (<>
        <div>Ошибка: страница не найдена.</div>
        <button className="notFound" onClick={(event) => {
            event.preventDefault()
            navigate(-1)
        }}>Вернуться обратно</button>
    </>)
}

export default NotFound