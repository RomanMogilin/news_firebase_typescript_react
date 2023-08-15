import { useSelector } from "react-redux"
import { GlobalStore, StorePost } from '../../store/types';
import React from "react";
import './dashboard.css'
import { useNavigate } from "react-router-dom";
import Button from "../../isolatedComponents/Button";
import { deletePost } from "../../firebase/firestore";
import Post from "../../isolatedComponents/Post";

const Dashboard = () => {

    const userUid = useSelector((state: GlobalStore) => state.auth.userUid);
    const userPosts = useSelector((state: GlobalStore) => state.user.posts);
    const userDateOfRegistration = useSelector((state: GlobalStore) => state.user.dateOfRegistration);
    const userName = useSelector((state: GlobalStore) => state.user.userName);
    console.log(userPosts)

    let navigate = useNavigate()

    return (<React.Fragment>
        <div>Dashboard</div>
        <div>UserUID: {userUid}</div>
        <div>Nickname: {userName}</div>
        <div>DateOfRegistration: {userDateOfRegistration}</div>
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
            {userPosts.length > 0 ? userPosts.map((postDate: StorePost, index: number) => (<div key={index}>
                <Post postDate={postDate} />
                <Button
                    cssType="edit"
                    text="Edit Post"
                    callback={() => navigate('/profile/dashboard/edit-post', {
                        state: {
                            id: postDate.id,
                            date: postDate.date,
                            content: {
                                anons_img: postDate.content.anons_img,
                                header: postDate.content.header,
                                text: postDate.content.text,
                                anons: postDate.content.anons,
                            },
                            author: postDate.author
                        }
                    })
                    }
                />
                <Button
                    cssType="delete"
                    text="Delete"
                    callback={() => deletePost(postDate.id, userUid)}
                />
            </div>)) : 'У вас пока нет постов'}
        </div>
    </React.Fragment>)
}

export default Dashboard