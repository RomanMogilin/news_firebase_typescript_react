import React, { FunctionComponent } from "react"
import { StorePost } from "../store/types"

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
    postDate: StorePost,
}

const Post: FunctionComponent<PostProps> = ({ postDate }) => {
    return (<React.Fragment key={`${postDate.id}_${postDate}`}>
        <div>id: {postDate.id}</div>
        <div>date: {postDate.date}</div>
        <div>Author: {postDate.author}</div>
        <div>Img: {postDate.content.anons_img}</div>
        <div>Header: {postDate.content.header}</div>
        <div>Anons: {postDate.content.anons}</div>
        <div>Text: {postDate.content.text}</div>
    </React.Fragment>)
}

export default Post