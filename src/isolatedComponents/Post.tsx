import React, { FunctionComponent } from "react"
import { StorePost } from "../store/types"
import Reaction from "./Reaction"

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
    postDate: StorePost,
    canReact: boolean,
}

const Post: FunctionComponent<PostProps> = ({ postDate, canReact }) => {
    return (<React.Fragment key={`${postDate.id}_${postDate.date}`}>
        <div>id: {postDate.id}</div>
        <div>date: {postDate.date}</div>
        <div>Author: {postDate.author}</div>
        <div>Img: {postDate.content.anons_img}</div>
        <div>Header: {postDate.content.header}</div>
        <div>Anons: {postDate.content.anons}</div>
        <div>Text: {postDate.content.text}</div>
        <Reaction canReact={canReact} type={'post'} payload={{ post: postDate }} />
    </React.Fragment>)
}

export default Post