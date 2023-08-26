import { useLocation, useParams } from "react-router-dom"
import { GlobalStore, PostComment, StorePost } from "../store/types"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addComment, deleteComment } from "../firebase/firestore"
import { ADD_NEWS_POST_COMMENT } from "../store/consts"
import Button from "../isolatedComponents/Button"
import Reaction from "../isolatedComponents/Reaction"

const PostPage = () => {
    const loading = useSelector((state: GlobalStore) => state.news.loading)
    const { postId } = useParams()
    const location = useLocation()
    const locationState: { commentId: string } | undefined = location.state;
    const commentRef = useRef<HTMLDivElement>(null)
    const otherCommentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        commentRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [loading])

    const isAuth = useSelector((state: GlobalStore) => state.auth.isAuth)
    const UserUID = useSelector((state: GlobalStore) => state.auth.userUid)
    const addCommentInputRef = useRef<HTMLInputElement>(null)
    let posts: StorePost[] | [] = useSelector((state: GlobalStore) => state.news.posts)
    let post = loading ? posts.filter((post: StorePost) => post.id === postId)[0] : {
        id: '0',
        date: 0,
        content: {
            anons_img: '',
            header: '',
            text: '',
            anons: '',
        },
        author: '',
        reaction: {
            likes: 0,
            dislikes: 0,
            views: 0
        },
        comments: []
    }
    console.log('/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////')
    console.log(post)
    console.log(post.comments)
    let [comments, changeComments] = useState<[] | PostComment[]>(post.comments)
    const dispatch = useDispatch()

    console.log(postId)
    console.log(comments)
    const [canChangeComments, changeCanChangeComments] = useState(true)
    let loadingTime: number = 750
    let delta: number = 25
    for (let i = 0; i < post.comments.length; i++) {
        loadingTime += delta;
        if (delta > 5) {
            delta -= 1
        }
    }
    console.log(loadingTime)
    setTimeout(() => {
        if (canChangeComments) {
            changeComments((prevState: [] | PostComment[]) => post.comments)
            changeCanChangeComments(false)
        }
    }, loadingTime)

    if (loading) {

        return (<div>
            <div>postId: {postId}</div>
            <div>Header: {post.content.header}</div>
            <div>postImg: {post.content.anons_img}</div>
            <div>Text: {post.content.text}</div>
            {comments && Array.isArray(comments) && isAuth && <form onSubmit={(event) => {
                event.preventDefault()
                console.log(postId, addCommentInputRef.current)
                if (addCommentInputRef.current && postId) {
                    let currentText: string = addCommentInputRef.current.value;
                    let newComment: PostComment = {
                        id: `${UserUID}_${Date.now()}`,
                        author: UserUID,
                        commentReaction: {
                            likes: 0,
                            dislikes: 0,
                        },
                        commentDependences: null,
                        text: currentText
                    }
                    console.log(`newComment PostPageComponent:`, newComment)
                    addComment(postId, newComment)
                    dispatch({
                        type: ADD_NEWS_POST_COMMENT, addNewsPostComment: {
                            post,
                            newComment: newComment
                        }
                    })
                    changeComments((prevState: [] | PostComment[]) => [newComment, ...prevState])
                    addCommentInputRef.current.value = ''
                }
            }}>
                <div>Добавить комментарий:</div>
                <input ref={addCommentInputRef} type='text' placeholder="Введите текст комментария..."></input>
                <button type="submit">Добавить</button>
            </form>}
            <div>
                <div>комментарии:</div>
                <div>
                    {comments && comments.length > 0 ? comments.map((comment: PostComment) => {
                        return (<div className="comment" ref={(locationState?.commentId && locationState.commentId === comment.id) ? commentRef : otherCommentRef} id={`${comment.id}`} key={comment.id}>
                            <div>Author: {comment.author}</div>
                            <div>id: {comment.id}</div>
                            <div>Text: {comment.text}</div>
                            <div>
                                <span>commentDependences:</span>
                                <span>{comment.commentDependences ? comment.commentDependences.map((commentId: string) => (<div>commentId: {commentId}</div>)) : 'Зависимости отсутствуют'}</span>
                                {postId && comment.author === UserUID && <Button text="Удалить" callback={() => {
                                    deleteComment(comment.id, postId)
                                    changeComments((prevState: [] | PostComment[]) => prevState.filter((currentComment: PostComment) => comment.id !== currentComment.id))
                                }} />}
                            </div>
                            <Reaction type='comment' canReact={true} payload={{ post: post, commentId: comment.id }} />
                        </div>)
                    }) : 'Комментарии отсутствуют'}
                </div>
            </div>
        </div>)
    }
    else {
        return (<div>Идёт загрузка...</div>)
    }
}

export default PostPage