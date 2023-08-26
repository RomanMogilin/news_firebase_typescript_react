import React, { FunctionComponent } from "react"
import { ReactionProps } from "./types"
import { useDispatch, useSelector } from "react-redux";
import { GlobalStore, PostComment, StorePost, UserReaction } from "../store/types";
import Button from "./Button";
import { ADD_USER_REACTION, DELETE_USER_REACTION, EDIT_NEWS_LIKES_AND_DISLIKES, EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, EDIT_NEWS_REACTION, EDIT_USER_REACTION } from "../store/consts";
import { updateFirestoreCollectionField } from "../firebase/firestore";
import { useNavigate } from "react-router-dom";

const Reaction: FunctionComponent<ReactionProps> = ({ type, canReact, payload }) => {

    let userReaction: UserReaction[] | [] = useSelector((state: GlobalStore) => state.user.reaction)
    let userReactionType: undefined | 'like' | 'dislike' = [...userReaction].find((userReactionElement: UserReaction) => {
        // console.log('UserReactionType:', type, userReactionElement, userReactionElement.commentId, userReactionElement.postId, payload.post.id, (!!!userReactionElement.commentId) && (userReactionElement.postId === payload.post.id));
        return (!!!userReactionElement.commentId) && (userReactionElement.postId === payload.post.id);
    })?.reaction
    let userReactionString: 'empty' | 'like' | 'dislike' = userReactionType === undefined ? "empty" : (userReactionType === 'dislike' ? "dislike" : "like")

    let userCommentReaction: undefined | 'like' | 'dislike' = type === 'comment' ? [...userReaction].find((userReactionElement: UserReaction) => (userReactionElement.postId === payload.post.id) && (userReactionElement.commentId === payload.commentId))?.reaction : undefined;
    let userCommentString: 'empty' | 'like' | 'dislike' = userCommentReaction === undefined ? "empty" : (userCommentReaction === 'dislike' ? "dislike" : "like");

    const userUid = useSelector((state: GlobalStore) => state.auth.userUid);
    const isAuth = useSelector((state: GlobalStore) => state.auth.isAuth);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logError = (message: string) => {
        return console.log(new Error(message))
    }

    const setReactionValues = (type: 'post' | 'comment'): [number, number, number, () => void, () => void, () => void] => {
        // if (type === 'post') {
        //0, 0, 0, () => console.log(new Error('Reaction component: Type is undefined')), () => console.log(new Error('Reaction component: Type is undefined')), () => console.log(new Error('Reaction component: Type is undefined'))
        let views: number = 0;
        let likes: number = 0;
        let dislikes: number = 0;
        let postId: Readonly<string> = payload.post.id;
        let commentId: string = '';
        let currentComments: PostComment | undefined;

        if (type === 'post') {
            views = payload.post.reaction.views;
            likes = payload.post.reaction.likes;
            dislikes = payload.post.reaction.dislikes;
        }
        else if (type === 'comment') {
            payload.commentId ? commentId = payload.commentId : logError('Cannot read property of payload.commentId. Reaction.tsx component.')
            currentComments = payload.post.comments.filter((comment: PostComment) => comment.id === commentId)[0]
            // userCommentReaction = [...userReaction].find((userReactionElement: UserReaction) => (userReactionElement.postId === payload.post.id) && (userReactionElement.commentId === payload.commentId))?.reaction;
            // console.log('------------------------------//////////////////////////////////////////////////', [...userReaction].find((userReactionElement: UserReaction) => (userReactionElement.postId === payload.post.id) && (userReactionElement.commentId === payload.commentId))?.reaction, '///////////////////////------------------------------------')
            likes = currentComments.commentReaction.likes;
            dislikes = currentComments.commentReaction.dislikes;
        }

        let changeViews = () => {
            dispatch({ type: EDIT_NEWS_REACTION, editNewsReaction: { ReactionType: 'view', postId, count: views + 1 } })
            updateFirestoreCollectionField('posts', postId, { reaction: { views: views + 1, likes, dislikes } })
            const postPageState: Readonly<StorePost> = payload.post
            navigate(`/news/${postId}`, { state: postPageState })
        }
        let changeLikes = () => {
            if (type === 'post') {
                if (userReactionString === 'empty') {
                    const newUserReaction: UserReaction = { postId, reaction: 'like' }
                    updateFirestoreCollectionField('posts', postId, { reaction: { likes: likes + 1, dislikes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction, newUserReaction] })
                    dispatch({ type: EDIT_NEWS_REACTION, editNewsReaction: { ReactionType: 'like', postId, count: likes + 1 } })
                    dispatch({ type: ADD_USER_REACTION, addUserReaction: newUserReaction })
                }
                else if (userReactionString === 'like') {
                    updateFirestoreCollectionField('posts', postId, { reaction: { likes: likes - 1, dislikes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction.filter((reaction: UserReaction) => reaction.postId === postId)] })
                    dispatch({ type: EDIT_NEWS_REACTION, editNewsReaction: { ReactionType: 'like', postId, count: likes - 1 } })
                    dispatch({ type: DELETE_USER_REACTION, deleteUserReaction: { postId: postId } })
                }
                else if (userReactionString === 'dislike') {
                    updateFirestoreCollectionField('users', userUid, {
                        reaction: [...userReaction.map((reaction: UserReaction) => {
                            if (reaction.postId === postId) {
                                let newReaction: UserReaction = { ...reaction }
                                newReaction.reaction = 'like'
                                return newReaction
                            }
                            else { return reaction }
                        })]
                    })
                    updateFirestoreCollectionField('posts', postId, { reaction: { likes: likes + 1, dislikes: dislikes - 1, views } })
                    dispatch({ type: EDIT_USER_REACTION, editUserReaction: { postId, reaction: 'like' } })
                    dispatch({ type: EDIT_NEWS_LIKES_AND_DISLIKES, editNewsLikesAndDislikes: { postId, likes: likes + 1, dislikes: dislikes - 1 } })
                }
            }
            ///type: comment///
            else if (type === 'comment') {
                if (userCommentString === 'empty') {
                    console.log('like+1')
                    let commentsInReaction: [] | PostComment[] = payload.post.comments
                    updateFirestoreCollectionField('posts', postId, {
                        comments: [...commentsInReaction].map((currentComment: PostComment) => {
                            if (currentComment.id === commentId) {
                                let newComment = { ...currentComment }
                                newComment.commentReaction.likes = likes + 1;
                                return newComment
                            }
                            else { return currentComment }
                        })
                    })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction, { postId, commentId, reaction: 'like' }] })
                    dispatch({
                        type: EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, editNewsPostCommentReactionLikesAndDislikes: {
                            likes: likes + 1,
                            dislikes: dislikes,
                            postId: postId,
                            commentId: commentId,
                        }
                    });
                    dispatch({ type: ADD_USER_REACTION, addUserReaction: { postId, commentId, reaction: 'like' } })
                }
                /// comment like like
                else if (userCommentString === 'like') {
                    console.log('like-1')
                    let commentsInReaction: [] | PostComment[] = payload.post.comments
                    updateFirestoreCollectionField('posts', postId, {
                        comments: [...commentsInReaction].map((currentComment: PostComment) => {
                            if (currentComment.id === commentId) {
                                let newComment = { ...currentComment }
                                newComment.commentReaction.likes = likes - 1;
                                return newComment
                            }
                            else { return currentComment }
                        })
                    })
                    updateFirestoreCollectionField('users', userUid, {
                        reaction: [...userReaction].filter((currentReaction: UserReaction) => {
                            return (!currentReaction.commentId) || (currentReaction.commentId !== commentId) || (currentReaction.postId !== postId)
                        })
                    })
                    dispatch({
                        type: EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, editNewsPostCommentReactionLikesAndDislikes: {
                            likes: likes + 1,
                            dislikes: dislikes,
                            postId: postId,
                            commentId: commentId,
                        }
                    });
                    dispatch({
                        type: EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, editNewsPostCommentReactionLikesAndDislikes: {
                            likes: likes - 1,
                            dislikes: dislikes,
                            postId: postId,
                            commentId: commentId,
                        }
                    });
                    dispatch({ type: DELETE_USER_REACTION, deleteUserReaction: { postId: postId, commentId: commentId } })
                }
                /// comment like dislike
                else if (userCommentString === 'dislike') {
                    console.log('like+1:dislike-1')

                    let commentsInReaction: [] | PostComment[] = payload.post.comments
                    updateFirestoreCollectionField('posts', postId, {
                        comments: [...commentsInReaction].map((currentComment: PostComment) => {
                            if (currentComment.id === commentId) {
                                let newComment = { ...currentComment }
                                newComment.commentReaction.likes = likes + 1;
                                newComment.commentReaction.dislikes = dislikes - 1;
                                return newComment
                            }
                            else { return currentComment }
                        })
                    })
                    updateFirestoreCollectionField('users', userUid, {
                        reaction: [...userReaction].map((currentReaction: UserReaction) => {
                            if (currentReaction.postId === postId && currentReaction.commentId === commentId) {
                                let newReaction = { ...currentReaction }
                                newReaction.reaction = 'like'
                                return newReaction;
                            }
                            else { return currentReaction }
                        })
                    })
                    dispatch({
                        type: EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, editNewsPostCommentReactionLikesAndDislikes: {
                            likes: likes + 1,
                            dislikes: dislikes - 1,
                            postId: postId,
                            commentId: commentId,
                        }
                    });
                    dispatch({ type: EDIT_USER_REACTION, editUserReaction: { postId, commentId, reaction: 'like' } })
                }
            }
        }
        let changeDislikes = () => {
            if (type === 'post') {
                if (userReactionString === 'empty') {
                    updateFirestoreCollectionField('posts', postId, { reaction: { dislikes: dislikes + 1, likes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction, { postId, reaction: 'dislike' }] })
                    dispatch({ type: EDIT_NEWS_REACTION, editNewsReaction: { ReactionType: 'dislike', postId, count: dislikes + 1 } })
                    dispatch({ type: ADD_USER_REACTION, addUserReaction: { postId, reaction: 'dislike' } })
                }
                else if (userReactionString === 'dislike') {
                    updateFirestoreCollectionField('posts', postId, { reaction: { dislikes: dislikes - 1, likes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction.filter((reaction: UserReaction) => reaction.postId === postId)] })
                    dispatch({ type: EDIT_NEWS_REACTION, editNewsReaction: { ReactionType: 'dislike', postId, count: dislikes - 1 } })
                    dispatch({ type: DELETE_USER_REACTION, deleteUserReaction: { postId: postId } })
                }
                else if (userReactionString === 'like') {
                    updateFirestoreCollectionField('users', userUid, {
                        reaction: [...userReaction.map((reaction: UserReaction) => {
                            if (reaction.postId === postId) {
                                let newReaction: UserReaction = { ...reaction }
                                newReaction.reaction = 'dislike'
                                return newReaction
                            }
                            else { return reaction }
                        })]
                    })
                    updateFirestoreCollectionField('posts', postId, { reaction: { likes: likes - 1, dislikes: dislikes + 1, views } })
                    dispatch({ type: EDIT_USER_REACTION, editUserReaction: { postId, reaction: 'dislike' } })
                    dispatch({ type: EDIT_NEWS_LIKES_AND_DISLIKES, editNewsLikesAndDislikes: { postId, likes: likes - 1, dislikes: dislikes + 1 } })
                }
            }
            /// type: comment
            else if (type === 'comment') {
                if (userCommentString === 'empty') {
                    console.log('dislike+1')
                    let commentsInReaction: [] | PostComment[] = payload.post.comments
                    updateFirestoreCollectionField('posts', postId, {
                        comments: [...commentsInReaction].map((currentComment: PostComment) => {
                            if (currentComment.id === commentId) {
                                let newComment = { ...currentComment }
                                newComment.commentReaction.dislikes = dislikes + 1;
                                return newComment
                            }
                            else { return currentComment }
                        })
                    })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction, { postId, commentId, reaction: 'dislike' }] })
                    dispatch({
                        type: EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, editNewsPostCommentReactionLikesAndDislikes: {
                            likes: likes,
                            dislikes: dislikes + 1,
                            postId: postId,
                            commentId: commentId,
                        }
                    });
                    dispatch({ type: ADD_USER_REACTION, addUserReaction: { postId, commentId, reaction: 'dislike' } })
                }
                /// comment dislike dislike
                else if (userCommentString === 'dislike') {
                    console.log('dislike-1')
                    let commentsInReaction: [] | PostComment[] = payload.post.comments
                    updateFirestoreCollectionField('posts', postId, {
                        comments: [...commentsInReaction].map((currentComment: PostComment) => {
                            if (currentComment.id === commentId) {
                                let newComment = { ...currentComment }
                                newComment.commentReaction.dislikes = dislikes - 1;
                                return newComment
                            }
                            else { return currentComment }
                        })
                    })
                    updateFirestoreCollectionField('users', userUid, {
                        reaction: [...userReaction].filter((currentReaction: UserReaction) => {
                            return (currentReaction.commentId !== commentId) && (currentReaction.postId !== postId)
                        })
                    })
                    dispatch({
                        type: EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, editNewsPostCommentReactionLikesAndDislikes: {
                            likes: likes,
                            dislikes: dislikes - 1,
                            postId: postId,
                            commentId: commentId,
                        }
                    });
                    dispatch({ type: DELETE_USER_REACTION, deleteUserReaction: { postId: postId, commentId: commentId } })
                }
                /// comment dislike like
                else if (userCommentString === 'like') {
                    console.log('dislike+1:like-1')
                    let commentsInReaction: [] | PostComment[] = payload.post.comments
                    updateFirestoreCollectionField('posts', postId, {
                        comments: [...commentsInReaction].map((currentComment: PostComment) => {
                            if (currentComment.id === commentId) {
                                let newComment = { ...currentComment }
                                newComment.commentReaction.likes = likes - 1;
                                newComment.commentReaction.dislikes = dislikes + 1;
                                return newComment
                            }
                            else { return currentComment }
                        })
                    })
                    updateFirestoreCollectionField('users', userUid, {
                        reaction: [...userReaction].map((currentReaction: UserReaction) => {
                            if (currentReaction.postId === postId && currentReaction.commentId === commentId) {
                                let newReaction = { ...currentReaction }
                                newReaction.reaction = 'dislike'
                                return newReaction;
                            }
                            else { return currentReaction }
                        })
                    })
                    dispatch({
                        type: EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, editNewsPostCommentReactionLikesAndDislikes: {
                            likes: likes - 1,
                            dislikes: dislikes + 1,
                            postId: postId,
                            commentId: commentId,
                        }
                    });
                    dispatch({ type: EDIT_USER_REACTION, editUserReaction: { postId, commentId, reaction: 'dislike' } })
                }
            }
        }
        return [views, likes, dislikes, changeViews, changeLikes, changeDislikes]
    }

    let [views, likes, dislikes, changeViews, changeLikes, changeDislikes] = setReactionValues(type)

    return (<React.Fragment>
        {!payload.commentId && <div>type: {type}, canReact: {canReact ? 'true' : 'false'}, userReaction: {userReactionString}</div>}
        {payload.commentId && (<div>type: {type}, canReact: {canReact ? 'true' : 'false'}, userCommentReaction: {userCommentString}</div>)}
        <div>
            {type === 'post' && (<>Views: {views} <Button callback={() => changeViews()} text="views" />,</>)}
            Likes: {likes} {canReact && isAuth && <Button text="like" callback={() => changeLikes()} />},
            Dislikes: {dislikes} {canReact && isAuth && <Button callback={() => changeDislikes()} text="dislike" />}
        </div>
    </React.Fragment>)
}

export default Reaction