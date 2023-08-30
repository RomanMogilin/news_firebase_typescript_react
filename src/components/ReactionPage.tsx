import React from "react"
import { GlobalStore, UserReaction } from "../store/types";
import { useSelector } from "react-redux";
import Button from "../isolatedComponents/Button";
import { useNavigate } from "react-router-dom";

const ReactionPage = () => {

    const userReaction = useSelector((state: GlobalStore) => state.user.reaction);
    const userUid = useSelector((state: GlobalStore) => state.auth.userUid);

    let navigate = useNavigate();

    return (<React.Fragment>
        <div>Reaction:</div>
        <div>{userReaction.length > 0 ?
            userReaction.map((reaction: UserReaction) => {
                console.log("Dashboard.tsx: reaction output:", reaction)
                if (reaction.commentId !== undefined) {
                    return (<div className="dashboard_reaction" key={`${userUid}_${reaction.postId}_${reaction.commentId}`}>
                        <div>PostId: {reaction.postId}</div>
                        <div>Reaction: {reaction.reaction}</div>
                        <div>CommentId: {reaction.commentId}</div>
                        <div>postHeader: {reaction.postHeader}</div>
                        <div>CommentHeader: {reaction.commentHeader}</div>
                        <Button text="перейти" callback={() => navigate(`/news/${reaction.postId}`, { state: { commentId: reaction.commentId } })} />
                    </div>)
                }
                else {
                    return (<div className="dashboard_reaction" key={!!reaction.commentId ? `${userUid}_${reaction.postId}` : `${userUid}_${reaction.postId}_${reaction.commentId}`}>
                        <div>PostId: {reaction.postId} <Button text="перейти" callback={() => navigate(`/news/${reaction.postId}`)} /></div>
                        <div>Reaction: {reaction.reaction}</div>
                        <div>PostHeader: {reaction.postHeader}</div>
                    </div>)
                }
            })
            :
            "На данный момент вы не оценивали посты других пользователей"
        }</div>
    </React.Fragment>)
}

export default ReactionPage