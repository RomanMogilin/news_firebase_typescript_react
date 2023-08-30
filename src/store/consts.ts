type ReducerConst = Lowercase<string>;
// authReducer.ts
export const EDIT_AUTH: ReducerConst = 'edit_auth';
export const EDIT_USER_UID: ReducerConst = 'edit_user_uid';
// newsReducer.ts
export const ADD_NEWS_POST_COMMENT: ReducerConst = 'add_news_post_comment';
export const ADD_NEWS_ONE: ReducerConst = 'add_news_one';

export const EDIT_NEWS_REACTION: ReducerConst = 'edit_news_reaction';
export const EDIT_NEWS_REACTION_VIEWS: ReducerConst = 'edit_news_reaction_views';
export const EDIT_NEWS: ReducerConst = 'add_news';
export const EDIT_NEWS_LIKES_AND_DISLIKES: ReducerConst = 'edit_news_likes_and_dislikes';
export const EDIT_NEWS_ONE: ReducerConst = 'edit_news_one';
export const EDIT_NEWS_POST_COMMENT_REACTION_LIKES_AND_DISLIKES: ReducerConst = 'edit_news_post_comment_reaction_likes_and_dislikes';
export const EDIT_NEWS_LOADING: ReducerConst = 'edit_news_loading';

export const DELETE_NEWS_ONE: ReducerConst = 'delete_news_one';
export const DELETE_NEWS_POST_COMMENT: ReducerConst = 'delete_news_post_comment';
// userReducer.ts
export const ADD_USER_REACTION: ReducerConst = 'add_user_reaction';
export const ADD_USER_POST: ReducerConst = 'add_user_post';

/**
 * @type {type: EDIT_USER_PROFILE_PHOTO, editUserProfilePhoto: string}
 * @description отвечает за изменение ссылки на картинку профиля
 */
export const EDIT_USER_PROFILE_PHOTO: ReducerConst = 'edit_user_profile_photo';
export const EDIT_USER_DESCRIPTION: ReducerConst = 'edit_user_description';
export const EDIT_USER_NAME: ReducerConst = 'edit_user_name';
export const EDIT_USER_DATE_OF_REGISTRATON: ReducerConst = 'edit_user_date_of_registration';
export const EDIT_USER_REACTION: ReducerConst = 'edit_user_reaction';

export const DELETE_USER_REACTION: ReducerConst = 'delete_user_reaction';
export const DELETE_USER_ONLY_POST_REACTION: ReducerConst = 'delete_user_only_post_reaction';
export const DELETE_USER_POST: ReducerConst = 'delete_user_post';
// devReducer.ts
export const CHANGE_DEV_MODE: ReducerConst = 'change_dev_mode';