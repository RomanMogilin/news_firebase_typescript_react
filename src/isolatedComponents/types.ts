import { ReactNode } from "react"
import { StorePost } from "../store/types"

export type cssType = 'delete' | 'edit' | 'create' | 'notFound'

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    text: string,
    callback: Function,
    cssType?: cssType
}


export interface ReactionProps extends React.HTMLAttributes<ReactNode> {
    type: 'comment' | 'post',
    canReact: boolean,
    payload: {
        post: StorePost,
        commentId?: string,
        commentHeader?: string,
    }
}