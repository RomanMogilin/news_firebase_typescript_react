import { useSelector } from "react-redux"
import { GlobalStore, StorePost, UserReaction } from '../../store/types';
import React from "react";
import './dashboard.css'
import { useNavigate } from "react-router-dom";
import Button from "../../isolatedComponents/Button";
import { deletePost } from "../../firebase/firestore";
import Post from "../../isolatedComponents/Post";

const Dashboard = () => {

    const userUid = useSelector((state: GlobalStore) => state.auth.userUid);
    const userPosts = useSelector((state: GlobalStore) => state.user.posts);
    const userReaction = useSelector((state: GlobalStore) => state.user.reaction);
    const userDateOfRegistration = useSelector((state: GlobalStore) => state.user.dateOfRegistration);
    const userName = useSelector((state: GlobalStore) => state.user.userName);

    let navigate = useNavigate()

    return (<React.Fragment>
        <div>Dashboard</div>
        <div>UserUID: {userUid}</div>
        <div>Nickname: {userName}</div>
        <div>DateOfRegistration: {userDateOfRegistration}</div>
        <div>Reaction:</div>
        <div>{userReaction.length > 0 ?
            userReaction.map((reaction: UserReaction) => {
                // console.log(docExists('posts', reaction.postId), 'postId')
                if (!!reaction.commentId) {
                    return (<div className="dashboard_reaction" key={`${userUid}_${reaction.postId}_${reaction.commentId}`}>
                        <div>PostId: {reaction.postId}</div>
                        <div>Reaction: {reaction.reaction}</div>
                        <div>CommentId: {reaction.commentId}</div>
                        <Button text="перейти" callback={() => navigate(`/news/${reaction.postId}`, { state: { commentId: reaction.commentId } })} />
                    </div>)
                }
                else {
                    return (<div className="dashboard_reaction" key={!!reaction.commentId ? `${userUid}_${reaction.postId}` : `${userUid}_${reaction.postId}_${reaction.commentId}`}>
                        <div>PostId: {reaction.postId} <Button text="перейти" callback={() => navigate(`/news/${reaction.postId}`)} /></div>
                        <div>Reaction: {reaction.reaction}</div>
                    </div>)
                }
            })
            :
            "На данный момент вы не оценивали посты других пользователей"
        }</div>
        <Button
            callback={() => navigate('/profile/dashboard/edit-profile-info')}
            cssType="edit"
            text="Change profile info"
        />
        <Button
            callback={() => navigate('/profile/dashboard/create-post', {
                state: { author: userUid }
            })}
            cssType="create"
            text="Create Post"
        />
        <div className="posts">
            {userPosts.length > 0 ? userPosts.map((postDate: StorePost, index: number) => {

                const dateForEdit: Readonly<StorePost> = {
                    id: postDate.id,
                    date: postDate.date,
                    content: {
                        anons_img: postDate.content.anons_img,
                        header: postDate.content.header,
                        text: postDate.content.text,
                        anons: postDate.content.anons,
                    },
                    author: postDate.author,
                    reaction: postDate.reaction,
                    comments: postDate.comments
                }

                return (<div key={index}>
                    <Post canReact={false} postDate={postDate} />
                    <Button
                        cssType="edit"
                        text="Edit Post"
                        callback={() => navigate('/profile/dashboard/edit-post', {
                            state: dateForEdit
                        })
                        }
                    />
                    <Button
                        cssType="delete"
                        text="Delete"
                        callback={() => deletePost(postDate.id, userUid)}
                    />
                </div>)
            }) : 'У вас пока нет постов'}
        </div>
    </React.Fragment>)
}

export default Dashboard