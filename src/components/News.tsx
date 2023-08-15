import React, { useEffect, useState } from "react";
import { StorePost } from "../store/types";
import { getPosts } from "../firebase/firestore";

const News = () => {

    const [posts, changePosts] = useState<[] | StorePost[]>([])

    useEffect(() => {

        getPosts().then((res) => {
            let newPosts: StorePost[] | [] = []
            res.forEach((post: any) => {
                newPosts = [...newPosts, { ...post.data(), id: post.id }]
            })
            changePosts((prevState: [] | StorePost[]) => [...prevState, ...newPosts])
        }).catch((err) => {
            console.log(err)
        })

    }, [])

    return (<>
        <div>Новости</div>
        <div>
            {
                posts.length > 0 ? posts.map((post: StorePost) => {
                    return (<div key={post.id}>{post.id}</div>)
                }) : "Новости отсутстуют на данный момент."}
        </div>
    </>)
}

export default News