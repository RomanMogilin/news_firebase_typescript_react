import React, { FunctionComponent } from "react"
import { ReactionProps } from "./types"
import { useDispatch, useSelector } from "react-redux";
import { GlobalStore, PostComment, StorePost, UserReaction } from "../store/types";
import Button from "./Button";
import { ADD_USER_REACTION, DELETE_USER_ONLY_POST_REACTION, DELETE_USER_REACTION, EDIT_NEWS_LIKES_AND_DISLIKES, EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, EDIT_NEWS_REACTION, EDIT_USER_REACTION } from "../store/consts";
import { updateFirestoreCollectionField } from "../firebase/firestore";
import { useNavigate } from "react-router-dom";
import { user } from "../store/functions/user";
import DevMode from "./DevMode";

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
            currentComments = payload.post.comments.filter((comment: PostComment) => comment.id === commentId)[0];
            likes = currentComments.commentReaction.likes;
            dislikes = currentComments.commentReaction.dislikes;
        }

        let changeViews = () => {
            dispatch({ type: EDIT_NEWS_REACTION, editNewsReaction: { ReactionType: 'view', postId, count: views + 1 } })
            updateFirestoreCollectionField('posts', postId, { reaction: { views: views + 1, likes, dislikes } })
            const postPageState: Readonly<StorePost> = payload.post
            navigate(`/news/${postId}`, { state: postPageState })
        }
        // console.log('Reaction.tsx|payload.post.content.header:', payload.post.content.header)
        let changeLikes = () => {
            if (type === 'post') {
                if (userReactionString === 'empty') {
                    const newUserReaction: UserReaction = { postId, reaction: 'like', postHeader: payload.post.content.header }
                    updateFirestoreCollectionField('posts', postId, { reaction: { likes: likes + 1, dislikes, views } });
                    updateFirestoreCollectionField('users', userUid, { reaction: [newUserReaction, ...userReaction] });
                    user.reaction.post.changeLikesAndDislikes(postId, likes + 1, dislikes);
                    dispatch({ type: ADD_USER_REACTION, addUserReaction: newUserReaction })
                }
                else if (userReactionString === 'like') {
                    updateFirestoreCollectionField('posts', postId, { reaction: { likes: likes - 1, dislikes, views } })
                    updateFirestoreCollectionField('users', userUid, {
                        reaction: [...userReaction].filter((reaction: UserReaction) => reaction.postId !== postId)
                    });
                    user.reaction.post.changeLikesAndDislikes(postId, likes - 1, dislikes);
                    dispatch({ type: DELETE_USER_ONLY_POST_REACTION, deleteUserOnlyPostReaction: postId })
                    // dispatch({ type: DELETE_USER_REACTION, deleteUserReaction: { postId: postId } })
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
                    let newReaction: UserReaction = { postId, reaction: 'like', postHeader: payload.post.content.header };
                    dispatch({ type: EDIT_USER_REACTION, editUserReaction: newReaction })
                    user.reaction.post.changeLikesAndDislikes(postId, likes + 1, dislikes - 1);
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
                    let newUserReaction: UserReaction = { postId, commentId, reaction: 'like', postHeader: payload.post.content.header, commentHeader: payload.commentHeader };
                    updateFirestoreCollectionField('users', userUid, { reaction: [newUserReaction, ...userReaction] })
                    user.reaction.comment.changeLikesAndDislikes(postId, commentId, likes + 1, dislikes);
                    dispatch({ type: ADD_USER_REACTION, addUserReaction: newUserReaction })
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
                    });
                    user.reaction.comment.changeLikesAndDislikes(postId, commentId, likes - 1, dislikes);
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
                    user.reaction.comment.changeLikesAndDislikes(postId, commentId, likes + 1, dislikes - 1);
                    let newReaction: UserReaction = { postId, commentId, reaction: 'like', postHeader: payload.post.content.header, commentHeader: payload.commentHeader };
                    dispatch({ type: EDIT_USER_REACTION, editUserReaction: newReaction })
                }
            }
        }
        let changeDislikes = () => {
            if (type === 'post') {
                if (userReactionString === 'empty') {
                    let newReaction: UserReaction = { postId, reaction: 'dislike', postHeader: payload.post.content.header };
                    updateFirestoreCollectionField('posts', postId, { reaction: { dislikes: dislikes + 1, likes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [newReaction, ...userReaction] })
                    user.reaction.post.changeLikesAndDislikes(postId, likes, dislikes + 1);
                    dispatch({ type: ADD_USER_REACTION, addUserReaction: newReaction })
                }
                else if (userReactionString === 'dislike') {
                    updateFirestoreCollectionField('posts', postId, { reaction: { dislikes: dislikes - 1, likes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction.filter((reaction: UserReaction) => reaction.postId !== postId)] })
                    user.reaction.post.changeLikesAndDislikes(postId, likes, dislikes - 1);
                    dispatch({ type: DELETE_USER_ONLY_POST_REACTION, deleteUserOnlyPostReaction: postId })
                }
                else if (userReactionString === 'like') {
                    updateFirestoreCollectionField('users', userUid, {
                        reaction: [...userReaction].map((reaction: UserReaction) => {
                            if (reaction.postId === postId) {
                                let newReaction: UserReaction = { ...reaction }
                                newReaction.reaction = 'dislike'
                                return newReaction
                            }
                            else { return reaction }
                        })
                    })
                    updateFirestoreCollectionField('posts', postId, { reaction: { likes: likes - 1, dislikes: dislikes + 1, views } })
                    let newReaction: UserReaction = { postId, reaction: 'dislike', postHeader: payload.post.content.header }
                    dispatch({ type: EDIT_USER_REACTION, editUserReaction: newReaction })
                    user.reaction.post.changeLikesAndDislikes(postId, likes - 1, dislikes + 1);
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
                    let newReaction: UserReaction = { postId, commentId, reaction: 'dislike', postHeader: payload.post.content.header, commentHeader: payload.commentHeader };
                    updateFirestoreCollectionField('users', userUid, { reaction: [newReaction, ...userReaction] })
                    user.reaction.comment.changeLikesAndDislikes(postId, commentId, likes, dislikes + 1);
                    dispatch({ type: ADD_USER_REACTION, addUserReaction: newReaction })
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
                    });
                    user.reaction.comment.changeLikesAndDislikes(postId, commentId, likes, dislikes - 1);
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
                    user.reaction.comment.changeLikesAndDislikes(postId, commentId, likes - 1, dislikes + 1);
                    let newReaction: UserReaction = { postId, commentId, reaction: 'dislike', postHeader: payload.post.content.header, commentHeader: payload.commentHeader }
                    dispatch({ type: EDIT_USER_REACTION, editUserReaction: newReaction })
                }
            }
        }
        return [views, likes, dislikes, changeViews, changeLikes, changeDislikes]
    }

    let [views, likes, dislikes, changeViews, changeLikes, changeDislikes] = setReactionValues(type)

    return (<React.Fragment>
        <DevMode>{!payload.commentId && <div>type: {type}, canReact: {canReact ? 'true' : 'false'}, userReaction: {userReactionString}</div>}
            {payload.commentId && (<div>type: {type}, canReact: {canReact ? 'true' : 'false'}, userCommentReaction: {userCommentString}</div>)}</DevMode>
        <div className="reaction">
            {type === 'post' && (<>Views: {views} <Button callback={() => changeViews()} text="views" />,</>)}
            Likes: {likes} {canReact && isAuth && <Button text="like" callback={() => changeLikes()} />},
            Dislikes: {dislikes} {canReact && isAuth && <Button callback={() => changeDislikes()} text="dislike" />}
        </div>
    </React.Fragment>)
}

export default Reaction