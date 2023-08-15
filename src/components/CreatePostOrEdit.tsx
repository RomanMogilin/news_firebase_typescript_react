import React, { FunctionComponent, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { StorePost } from "../store/types"
import { addPost, editPost } from "../firebase/firestore"

interface CreateOrEditPostProps extends React.HTMLAttributes<HTMLElement> {
    type: 'edit' | 'create'
}

const CreateOrEditPost: FunctionComponent<CreateOrEditPostProps> = ({ type }) => {

    const location = useLocation()
    let locationStore: StorePost = {
        id: '',
        date: 0,
        content: {
            anons_img: '',
            header: '',
            text: '',
            anons: '',
        },
        author: location.state.author
    }

    const inputAnonsImgRef = useRef<HTMLInputElement>(null)
    const inputHeaderRef = useRef<HTMLInputElement>(null)
    const inputAnonsRef = useRef<HTMLInputElement>(null)
    const inputTextRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

    if (type === 'edit') {
        locationStore = { ...location.state }
    }

    const CreateUserOnSubmit = (event: any) => {
        event.preventDefault()
        if (inputAnonsImgRef.current && inputAnonsRef.current && inputHeaderRef.current && inputTextRef.current) {
            if (type === 'create') {
                addPost(locationStore.author, {
                    header: inputHeaderRef.current.value,
                    anons: inputAnonsRef.current.value,
                    text: inputTextRef.current.value,
                    anons_img: inputAnonsImgRef.current.value,
                })
                navigate('/profile/dashboard')
            }
            else if (type === 'edit') {
                editPost(locationStore.id, {
                    header: inputHeaderRef.current.value,
                    anons: inputAnonsRef.current.value,
                    text: inputTextRef.current.value,
                    anons_img: inputAnonsImgRef.current.value,
                })
                navigate('/profile/dashboard')
            }
        }
    }

    return (<React.Fragment>
        <div>{type === 'create' ? 'Создать пост:' : 'Редактировать пост:'}</div>
        <form onSubmit={(event) => CreateUserOnSubmit(event)}>
            <div>Картинка анонса:</div>
            <input ref={inputAnonsImgRef} type="text" defaultValue={locationStore.content.anons_img} />
            <div>Загаловок:</div>
            <input ref={inputHeaderRef} type="text" defaultValue={locationStore.content.header} />
            <div>Анонс:</div>
            <input ref={inputAnonsRef} type="text" defaultValue={locationStore.content.anons} />
            <div>Текст:</div>
            <input ref={inputTextRef} type="text" defaultValue={locationStore.content.text} />
            <button type="submit">{type === 'create' ? 'Создать' : 'Сохранить'}</button>
        </form>
    </React.Fragment>)
}

export default CreateOrEditPost