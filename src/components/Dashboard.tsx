import { useSelector } from "react-redux"
import { GlobalStore } from '../store/types';
import React from "react";

const Dashboard = () => {

    const userUid = useSelector((state: GlobalStore) => state.auth.userUid)

    return (<React.Fragment>
        <div>Dashboard</div>
        <div>UserUID: {userUid}</div>
    </React.Fragment>)
}

export default Dashboard