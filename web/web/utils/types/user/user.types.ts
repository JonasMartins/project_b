import { EmotionType } from "generated/graphql";

export type userGetUserByIdType =
    | {
          __typename?: "User" | undefined;
          id: string;
          name: string;
          email: string;
          picture?: string | null | undefined;
          files?: Array<string> | null | undefined;
          connections?:
              | Array<{
                    __typename?: "User";
                    id: string;
                    name: string;
                    picture?: string | null | undefined;
                }>
              | null
              | undefined;
          posts?:
              | Array<{
                    __typename?: "Post";
                    id: string;
                    body: string;
                    comments?:
                        | Array<{
                              __typename?: "Comment";
                              id: string;
                              body: string;
                              author: {
                                  __typename?: "User";
                                  id: string;
                                  name: string;
                                  picture?: string | null | undefined;
                              };
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
                }>
              | null
              | undefined;
      }
    | null
    | undefined;

export interface userInvitationsType {
    __typename?: "Request" | undefined;
    id: string;
    accepted?: boolean | null | undefined;
    requestor: {
        __typename?: "User" | undefined;
        id: string;
        name: string;
        picture?: string | null | undefined;
    };
}

export interface userConnectionType {
    __typename?: "User" | undefined;
    id: string;
    name: string;
    picture?: string | null | undefined;
}
