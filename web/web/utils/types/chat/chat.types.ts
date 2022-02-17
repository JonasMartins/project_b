export type chats =
    | {
          __typename?: "Chat" | undefined;
          id: string;
          participants: {
              __typename?: "User" | undefined;
              id: string;
              name: string;
              picture?: string | null | undefined;
          }[];
          messages?:
              | {
                    __typename?: "Message" | undefined;
                    id: string;
                    body: string;
                    creator: {
                        __typename?: "User";
                        id: string;
                        name: string;
                        picture?: string | null | undefined;
                    };
                }[]
              | null
              | undefined;
      }[]
    | null
    | undefined;
