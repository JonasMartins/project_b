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
    files?: Array<string> | null | undefined;
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

export type getPostsType = {
    __typename?: "Post";
    id: string;
    body: string;
    files?: Array<string> | null | undefined;
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
