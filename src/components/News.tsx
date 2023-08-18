import React, { useEffect } from "react";
import { GlobalStore, StorePost } from "../store/types";
import { getPosts } from "../firebase/firestore";
import Post from "../isolatedComponents/Post";
import { store } from "../store/store";
import { EDIT_NEWS } from "../store/consts";
import { useSelector } from "react-redux";

const News = () => {

    useEffect(() => {

        getPosts().then((res) => {
            let newPosts: StorePost[] | [] = []
            res.forEach((post: any) => {
                newPosts = [...newPosts, { ...post.data(), id: post.id }]
            })
            store.dispatch({ type: EDIT_NEWS, payload: { editNews: newPosts } })
        }).catch((err) => {
            console.log(err)
        })

        console.log('News Mount')

    }, [])

    let posts = useSelector((state: GlobalStore) => state.news.posts)

    return (<>
        <div>Новости</div>
        <div className="posts">
            {posts.length > 0 ?
                posts.map((post: StorePost) => {
                    return (<div key={`news_${post.id}_${post.date}`}><Post canReact={true} key={`news_${post.id}_${post.date}`} postDate={post} /></div>)
                })
                :
                "Новости отсутстуют на данный момент."}
        </div>
    </>)
}

export default News