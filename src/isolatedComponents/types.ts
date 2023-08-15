export type cssType = 'delete' | 'edit' | 'create' | 'notFound'

export interface ButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    text: string,
    callback: Function,
    cssType?: cssType
}

export interface PathForNavigate {
    pathname: string;
    search: string;
    hash: string;
}

export type Path = string | Partial<PathForNavigate>;