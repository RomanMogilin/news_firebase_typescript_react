import React, { FunctionComponent } from "react"
import { ReactionProps } from "./types"
import { useDispatch, useSelector } from "react-redux";
import { GlobalStore, UserReaction } from "../store/types";
import Button from "./Button";
import { ADD_USER_REACTION, DELETE_USER_REACTION, EDIT_NEWS_LIKES_AND_DISLIKES, EDIT_NEWS_REACTION, EDIT_USER_REACTION } from "../store/consts";
import { updateFirestoreCollectionField } from "../firebase/firestore";

const Reaction: FunctionComponent<ReactionProps> = ({ type, canReact, payload }) => {

    let userReaction: UserReaction[] | [] = useSelector((state: GlobalStore) => state.user.reaction)
    let userReactionType = [...userReaction].find((userReactionElement: UserReaction) => userReactionElement.postId === payload.post.id)?.reaction
    let userReactionString: 'empty' | 'like' | 'dislike' = userReactionType === undefined ? "empty" : (userReactionType === 'dislike' ? "dislike" : "like")

    const userUid = useSelector((state: GlobalStore) => state.auth.userUid);
    const isAuth = useSelector((state: GlobalStore) => state.auth.isAuth);

    const dispatch = useDispatch()

    const setReactionValues = (type: 'post' | 'comment'): [number, number, number, () => void, () => void, () => void] => {
        if (type === 'post') {
            let views: number = payload.post.reaction.views
            let likes: number = payload.post.reaction.likes
            let dislikes: number = payload.post.reaction.dislikes
            const postId: Readonly<string> = payload.post.id

            let changeViews = () => {
                dispatch({ type: EDIT_NEWS_REACTION, payload: { editNewsReaction: { ReactionType: 'view', postId, count: views + 1 } } })
                updateFirestoreCollectionField('posts', postId, { reaction: { views: views + 1, likes, dislikes } })
            }
            let changeLikes = () => {
                if (userReactionString === 'empty') {
                    updateFirestoreCollectionField('posts', postId, { reaction: { likes: likes + 1, dislikes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction, { postId, reaction: 'like' }] })
                    dispatch({ type: EDIT_NEWS_REACTION, payload: { editNewsReaction: { ReactionType: 'like', postId, count: likes + 1 } } })
                    dispatch({ type: ADD_USER_REACTION, payload: { postId, reaction: 'like' } })
                }
                else if (userReactionString === 'like') {
                    updateFirestoreCollectionField('posts', postId, { reaction: { likes: likes - 1, dislikes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction.filter((reaction: UserReaction) => reaction.postId === postId)] })
                    dispatch({ type: EDIT_NEWS_REACTION, payload: { editNewsReaction: { ReactionType: 'like', postId, count: likes - 1 } } })
                    dispatch({ type: DELETE_USER_REACTION, payload: { postId } })
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
                    dispatch({ type: EDIT_USER_REACTION, payload: { postId, reaction: 'like' } })
                    dispatch({ type: EDIT_NEWS_LIKES_AND_DISLIKES, payload: { editNewsLikesAndDislikes: { postId, likes: likes + 1, dislikes: dislikes - 1 } } })
                }
            }
            let changeDislikes = () => {
                if (userReactionString === 'empty') {
                    updateFirestoreCollectionField('posts', postId, { reaction: { dislikes: dislikes + 1, likes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction, { postId, reaction: 'dislike' }] })
                    dispatch({ type: EDIT_NEWS_REACTION, payload: { editNewsReaction: { ReactionType: 'dislike', postId, count: dislikes + 1 } } })
                    dispatch({ type: ADD_USER_REACTION, payload: { postId, reaction: 'dislike' } })
                }
                else if (userReactionString === 'dislike') {
                    updateFirestoreCollectionField('posts', postId, { reaction: { dislikes: dislikes - 1, likes, views } })
                    updateFirestoreCollectionField('users', userUid, { reaction: [...userReaction.filter((reaction: UserReaction) => reaction.postId === postId)] })
                    dispatch({ type: EDIT_NEWS_REACTION, payload: { editNewsReaction: { ReactionType: 'dislike', postId, count: dislikes - 1 } } })
                    dispatch({ type: DELETE_USER_REACTION, payload: { postId } })
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
                    dispatch({ type: EDIT_USER_REACTION, payload: { postId, reaction: 'dislike' } })
                    dispatch({ type: EDIT_NEWS_LIKES_AND_DISLIKES, payload: { editNewsLikesAndDislikes: { postId, likes: likes - 1, dislikes: dislikes + 1 } } })
                }
            }
            return [views, likes, dislikes, changeViews, changeLikes, changeDislikes]
        }
        else {
            return [0, 0, 0, () => console.log(new Error('Reaction component: Type is undefined')), () => console.log(new Error('Reaction component: Type is undefined')), () => console.log(new Error('Reaction component: Type is undefined'))]
        }
    }

    let [views, likes, dislikes, changeViews, changeLikes, changeDislikes] = setReactionValues(type)

    return (<React.Fragment>
        <div>type: {type}, canReact: {canReact ? 'true' : 'false'}, userReaction: {userReactionString}</div>
        <div>
            Views: {views} <Button callback={() => changeViews()} text="views" />,
            Likes: {likes} {canReact && isAuth && <Button text="like" callback={() => changeLikes()} />},
            Dislikes: {dislikes} {canReact && isAuth && <Button callback={() => changeDislikes()} text="dislike" />}
        </div>
    </React.Fragment>)
}

export default Reaction