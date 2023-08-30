import { EDIT_NEWS_LIKES_AND_DISLIKES, EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES } from "../consts";
import { store } from "../store";

export const user = {
    reaction: {
        comment: {
            changeLikesAndDislikes: (postId: string, commentId: string, likes: number, dislikes: number) => {
                store.dispatch({
                    type: EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES, editNewsPostCommentReactionLikesAndDislikes: {
                        likes,
                        dislikes,
                        postId,
                        commentId,
                    }
                });
            }
        },
        post: {
            changeLikesAndDislikes: (postId: string, likes: number, dislikes: number) => {
                store.dispatch({ type: EDIT_NEWS_LIKES_AND_DISLIKES, editNewsLikesAndDislikes: { postId, likes, dislikes } })
            }
        }
    }
}