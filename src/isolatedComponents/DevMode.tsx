import { useSelector } from "react-redux";
import { GlobalStore } from "../store/types";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";

interface devModeProps extends HTMLAttributes<ReactElement> { }

const DevMode: FunctionComponent<devModeProps> = ({ children }) => {

    let devMode: boolean = useSelector((state: GlobalStore) => state.dev.devMode) === 'development';

    if (devMode === true) {
        return (<React.Fragment>{children}</React.Fragment>)
    }
    else { return (<React.Fragment></React.Fragment>) }
}

export default DevMode;