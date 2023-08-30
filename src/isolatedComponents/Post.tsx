import React, { FunctionComponent, useEffect, useState } from "react"
import { GlobalStore, StorePost, UserFirebaseStore, UserStore } from "../store/types"
import Reaction from "./Reaction"
import { useNavigate } from "react-router-dom"
import Button from "./Button"
import { getDocFromFirebase } from "../firebase/firestore"
import { useSelector } from "react-redux"
import DevMode from "./DevMode";

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
    postDate: StorePost,
    canReact: boolean,
    canSeeProfile?: boolean,
}

const Post: FunctionComponent<PostProps> = ({ postDate, canReact, canSeeProfile = true }) => {

    let [userDate, changeUserDate] = useState<UserFirebaseStore | null | false>(null);


    useEffect(() => {
        if (userDate === null) {
            getDocFromFirebase("users", postDate.author).then((res) => {
                changeUserDate(res as UserFirebaseStore)
            }).catch(() => changeUserDate(false))
        }
    }, [userDate])

    const navigate = useNavigate()
    return (<React.Fragment key={`${postDate.id}_${postDate.date}`}>
        <DevMode>
            <div>id: {postDate.id}</div>
            <div>date: {postDate.date}</div>
        </DevMode>
        {canSeeProfile && <React.Fragment>
            <DevMode><div>Author: {postDate.author}</div></DevMode>
            <div className="profile_info">
                <div className="post_profile_photo" onClick={(event) => {
                    event.preventDefault()
                    navigate(`/profile/${postDate.author}`)
                }}>
                    <img alt={'Фото профиля отстусттвует'} src={userDate ? userDate.profilePhoto : ''}></img>
                </div>
                {userDate && <div>{userDate.userName}</div>}
                {/* <Button text="Посмотреть профиль" callback={() => navigate(`/profile/${postDate.author}`)} /> */}
            </div>
        </React.Fragment>}
        <DevMode><div>Img: {postDate.content.anons_img}</div></DevMode>
        <div className="post_img">
            <img alt={'Картинка не найдена'} src={postDate.content.anons_img}></img>
        </div>
        <div className="title"><DevMode>Header: </DevMode>{postDate.content.header}</div>
        <div className="text"><DevMode>Anons: </DevMode>{postDate.content.anons}</div>
        <DevMode><div>Text: {postDate.content.text}</div></DevMode>
        <Reaction canReact={canReact} type={'post'} payload={{ post: postDate }} />
    </React.Fragment>)
}

export default Post