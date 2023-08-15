import { useNavigate } from "react-router-dom"
import './notFound.css'
import Button from "../../isolatedComponents/Button"

const NotFound = () => {

    let navigate = useNavigate()

    return (<>
        <div>Ошибка: страница не найдена.</div>
        <Button
            callback={() => navigate(-1)}
            cssType="notFound"
            text="Вернуться обратно"
        />
    </>)
}

export default NotFound