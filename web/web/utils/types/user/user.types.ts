export type userGetUserByIdType =
    | {
          __typename?: "User" | undefined;
          id: string;
          name: string;
          email: string;
          picture?: string | null | undefined;
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
                }>
              | null
              | undefined;
      }
    | null
    | undefined;
