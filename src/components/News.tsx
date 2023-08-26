import React from "react";
import { GlobalStore, StorePost } from "../store/types";
import Post from "../isolatedComponents/Post";
import { useSelector } from "react-redux";

const News = () => {

    // useEffect(() => {

    //     getPosts().then((res) => {
    //         let newPosts: StorePost[] | [] = []
    //         res.forEach((post: any) => {
    //             newPosts = [...newPosts, { ...post.data(), id: post.id }]
    //         })
    //         store.dispatch({ type: EDIT_NEWS, editNews: newPosts })
    //     }).catch((err) => {
    //         console.log(err)
    //     })

    //     console.log('News Mount')

    // }, [])

    let posts = useSelector((state: GlobalStore) => state.news.posts)

    return (<>
        <div>Новости</div>
        <div className="posts">
            {posts.length > 0 ?
                posts.map((post: StorePost) => {
                    // console.log('News.tsx:', post)
                    return (<div key={`news_${post.id}_${post.date}`}><Post canReact={true} key={`news_${post.id}_${post.date}`} postDate={post} /></div>)
                })
                :
                "Новости отсутстуют на данный момент."}
        </div>
    </>)
}

export default News