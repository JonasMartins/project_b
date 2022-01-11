import { EmotionType } from "generated/graphql";

export type emotion = {
    __typename?: "Emotion";
    type: EmotionType;
    creator: { __typename?: "User"; id: string; name: string };
};

export type getPostsType = {
    __typename?: "Post";
    id: string;
    body: string;
    files?: Array<string> | null | undefined;
    emotions?:
        | Array<{
              __typename?: "Emotion";
              type: EmotionType;
              creator: { __typename?: "User"; id: string; name: string };
          }>
        | null
        | undefined;
    creator: { __typename?: "User"; id: string; name: string };
};
