import React, { Dispatch, FunctionComponent, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { GlobalStore, PostContent, StorePost } from "../store/types"
import { addPost, editPost, updateFirestoreCollectionField } from "../firebase/firestore"
import { useDispatch, useSelector } from "react-redux"
import { EDIT_USER_PROFILE_PHOTO } from "../store/consts"
import { addImg } from "../firebase/init"

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
        author: location.state.author,
        reaction: {
            likes: 0,
            dislikes: 0,
            views: 0
        },
        comments: []
    }

    const inputAnonsImgRef = useRef<HTMLInputElement>(null)
    const inputHeaderRef = useRef<HTMLInputElement>(null)
    const inputAnonsRef = useRef<HTMLInputElement>(null)
    const inputTextRef = useRef<HTMLInputElement>(null)

    const userUid = useSelector((state: GlobalStore) => state.auth.userUid);
    const dateOfRegistration = useSelector((state: GlobalStore) => state.user.dateOfRegistration);

    const [anonsImg, changeAnonsImg] = useState<string>('')
    const [canSubmit, changeCanSubmit] = useState<boolean>(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (type === 'edit') {
        locationStore = { ...location.state }
    }

    useEffect(() => {
        if (type === 'edit') {
            console.log('edit')
            anonsImg === '' && changeAnonsImg(locationStore.content.anons_img)
            console.log(anonsImg)
        }
    }, [locationStore])

    useEffect(() => {
        console.log('anonsImg:', anonsImg)
    }, [anonsImg])

    const CreateUserOnSubmit = (event: any) => {
        event.preventDefault()
        if (inputAnonsRef.current && inputHeaderRef.current && inputTextRef.current && canSubmit) {
            const newPostContent: Readonly<PostContent> = {
                header: inputHeaderRef.current.value,
                anons: inputAnonsRef.current.value,
                text: inputTextRef.current.value,
                anons_img: anonsImg,
            }
            if (type === 'create') {
                locationStore.content = newPostContent
                addPost(locationStore.author, newPostContent)
                // dispatch({ type: ADD_NEWS_ONE, addNewsOne: newPost })
                navigate('/profile/dashboard')
            }
            else if (type === 'edit') {
                // dispatch({ type: ADD_NEWS_ONE, addNewsOne: newPostContent })
                editPost(locationStore.id, newPostContent, locationStore.reaction)
                navigate('/profile/dashboard')
            }
        }
    }

    const copyString = (str: string) => {
        let newStr: string = new String(str).toString()
        console.log('newStr:', newStr)
        return newStr
    }

    return (<React.Fragment>
        <div>{type === 'create' ? 'Создать пост:' : 'Редактировать пост:'}</div>
        <form onSubmit={(event) => {
            event.preventDefault();
            if (inputAnonsImgRef.current?.files) {
                changeCanSubmit(false)
                console.log(inputAnonsImgRef.current.files[0])
                console.log(inputAnonsImgRef.current.value)
                let storagePath: string = `${dateOfRegistration}_img_${userUid}_${locationStore.id}`
                console.log(storagePath)
                addImg(storagePath, inputAnonsImgRef.current.files[0], userUid, '').then((res) => {
                    if (res && inputAnonsRef.current && inputHeaderRef.current && inputTextRef.current && type === 'edit') {
                        updateFirestoreCollectionField('posts', locationStore.id, {
                            content: {
                                header: inputHeaderRef.current.value,
                                anons: inputAnonsRef.current.value,
                                text: inputTextRef.current.value,
                                anons_img: res,
                            }
                        })
                    }
                    changeCanSubmit(true)
                    return res
                }).then((res) => {
                    res && changeAnonsImg(() => copyString(res))
                    res && console.log(res, 'nnn')
                    res && console.log(anonsImg, '/00000000000/', res === copyString(res))
                }).catch(() => changeCanSubmit(true))
            }
        }}>
            <input type="file" ref={inputAnonsImgRef}></input>
            <button type="submit">загрузить фото</button>
        </form>
        <form onSubmit={(event) => CreateUserOnSubmit(event)}>
            {/* <div>Картинка анонса:</div>
            <input ref={inputAnonsImgRef} type="text" defaultValue={locationStore.content.anons_img} /> */}
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