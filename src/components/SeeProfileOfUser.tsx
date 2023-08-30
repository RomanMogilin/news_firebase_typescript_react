import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getDocFromFirebase } from "../firebase/firestore";
import { StorePost, UserFirebaseStore, UserStore } from "../store/types";
import Post from "../isolatedComponents/Post";

const SeeProfileOfUser = () => {

    let { userId } = useParams();
    let [userDate, changeUserDate] = useState<Omit<UserStore, "reaction"> | null | false>(null);

    type SeeUserStore = Omit<UserStore, "reaction">

    useEffect(() => {
        if (userDate === null && userId) {
            getDocFromFirebase("users", userId).then((res) => {
                let userFirebaseDate = res as UserFirebaseStore;
                let postList: string[] = userFirebaseDate.posts;
                Promise.all(postList.map((post: string) => getDocFromFirebase("posts", post))).then((res: (UserFirebaseStore | StorePost | null)[]) => {
                    console.log(res)
                    let postsDate = res as StorePost[] | null[]
                    if (postsDate.length > 0 && res.every((el) => el !== null) === true) {
                        let postListFromFirebase: StorePost[] = []
                        postListFromFirebase = postsDate as StorePost[]
                        let newUserFirebaseDate: any = { ...userFirebaseDate }
                        newUserFirebaseDate.posts = postListFromFirebase;
                        let finalDate: Omit<UserStore, "reaction"> = newUserFirebaseDate;
                        changeUserDate(finalDate)
                    }
                    else {
                        let newUserFirebaseDate: any = { ...userFirebaseDate }
                        newUserFirebaseDate.posts = [];
                        let finalDate: Omit<UserStore, "reaction"> = newUserFirebaseDate;
                        changeUserDate(finalDate)
                    }
                })
            }).catch(() => changeUserDate(false))
        }
    }, [userDate])

    if (userDate !== null && userDate !== false) {
        return (<React.Fragment>
            <div>SeePofile: {userId}</div>
            <div>
                <div>ProfilePhoto:</div>
                <div className="profile_photo">
                    <img alt={'Фото профиля'} src={userDate.profilePhoto}></img>
                </div>
                <div>Description: {userDate.description}</div>
                <div>NickName: {userDate.userName}</div>
                <div>DateOfRegistration: {userDate.dateOfRegistration}</div>
            </div>
            <div>
                <div>Posts:</div>
                <div className="posts">
                    {userDate.posts.length > 0 ? userDate.posts.map((post: StorePost) => (<div key={`SeeProfileOfUser_${post.id}_${post.date}`}><Post canSeeProfile={false} canReact={false} key={`SeeProfileOfUser_${post.id}_${post.date}`} postDate={post} /></div>)) : "У данного пользователя отсутсвтвуют посты"}
                </div>
            </div>
        </React.Fragment>)
    }
    else if (userDate === null) {
        return <React.Fragment>
            <div>Загрузка...</div>
        </React.Fragment>
    }
    else {
        return (<React.Fragment>
            <div>Такого пользователя не существует.</div>
        </React.Fragment>)
    }
}

export default SeeProfileOfUser