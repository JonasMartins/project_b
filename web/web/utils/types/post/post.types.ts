import { EmotionType } from "generated/graphql";

export type emotion = {
    __typename?: "Emotion";
    id: string;
    type: EmotionType;
    creator: { __typename?: "User"; id: string; name: string };
};

export type postEmotion = {
    __typename?: "PostEmotion";
    id: string;
    type: EmotionType;
    creator: { __typename?: "User"; id: string; name: string };
    post: { __typename?: "Post"; id: string };
};

export type getPostsByUserType = {
    __typename?: "Post";
    id: string;
    body: string;
    createdAt: any;
    files?: Array<string> | null | undefined;
    comments?:
        | Array<{
              __typename?: "Comment";
              id: string;
              body: string;
              createdAt: any;
              author: {
                  __typename?: "User";
                  id: string;
                  name: string;
                  picture?: string | null | undefined;
              };
              replies: Array<{
                  __typename?: "Comment";
                  id: string;
                  body: string;
                  createdAt: any;
                  author: {
                      __typename?: "User";
                      id: string;
                      name: string;
                      picture?: string | null | undefined;
                  };
              }>;
          }>
        | null
        | undefined;
    emotions?:
        | Array<{
              __typename?: "Emotion";
              id: string;
              type: EmotionType;
              creator: {
                  __typename?: "User";
                  id: string;
                  name: string;
              };
          }>
        | null
        | undefined;
};

export type singlePostComment = {
    __typename?: "Comment";
    id: string;
    body: string;
    createdAt: any;
    author: {
        __typename?: "User";
        id: string;
        name: string;
        picture?: string | null | undefined;
    };
    replies: Array<{
        __typename?: "Comment";
        id: string;
        body: string;
        createdAt: any;
        author: {
            __typename?: "User";
            id: string;
            name: string;
            picture?: string | null | undefined;
        };
    }>;
};

export type getPostsCommentsType = {
    comments?:
        | Array<{
              __typename?: "Comment";
              id: string;
              body: string;
              createdAt: any;
              author: {
                  __typename?: "User";
                  id: string;
                  name: string;
                  picture?: string | null | undefined;
              };
              replies: Array<{
                  __typename?: "Comment";
                  id: string;
                  body: string;
                  createdAt: any;
                  author: {
                      __typename?: "User";
                      id: string;
                      name: string;
                      picture?: string | null | undefined;
                  };
              }>;
          }>
        | null
        | undefined;
};

export type getPostsType = {
    __typename?: "Post";
    id: string;
    body: string;
    files?: Array<string> | null | undefined;
    createdAt: any;
    comments?:
        | Array<{
              __typename?: "Comment";
              id: string;
              body: string;
              createdAt: any;
              author: {
                  __typename?: "User";
                  id: string;
                  name: string;
                  picture?: string | null | undefined;
              };
              replies: Array<{
                  __typename?: "Comment";
                  id: string;
                  body: string;
                  createdAt: any;
                  author: {
                      __typename?: "User";
                      id: string;
                      name: string;
                      picture?: string | null | undefined;
                  };
              }>;
          }>
        | null
        | undefined;
    emotions?:
        | Array<{
              __typename?: "Emotion";
              id: string;
              type: EmotionType;
              creator: {
                  __typename?: "User";
                  id: string;
                  name: string;
              };
          }>
        | null
        | undefined;
    creator: {
        __typename?: "User";
        id: string;
        name: string;
        picture?: string | null | undefined;
    };
};
