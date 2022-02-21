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
                    createdAt: any;
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

export type participant = {
    __typename?: "User" | undefined;
    id: string;
    name: string;
    picture?: string | null | undefined;
};

export type GetTypesCache = {
    getChats: {
        __typename: "ChatsResponse";
        chats: chats;
    };
};

export type chat =
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
                    createdAt: any;
                    creator: {
                        __typename?: "User";
                        id: string;
                        name: string;
                        picture?: string | null | undefined;
                    };
                }[]
              | null
              | undefined;
      }
    | null
    | undefined;

export type message = {
    __typename?: "Message" | undefined;
    id: string;
    body: string;
    createdAt: any;
    creator: {
        __typename?: "User";
        id: string;
        name: string;
        picture?: string | null | undefined;
    };
};

export type messageSubscription =
    | {
          __typename?: "Message";
          id: string;
          body: string;
          createdAt: any;
          userSeen: Array<string>;
          creator: {
              __typename?: "User";
              id: string;
              name: string;
              picture?: string | null | undefined;
          };
          chat: {
              __typename?: "Chat";
              id: string;
              participants: Array<{
                  __typename?: "User";
                  id: string;
                  name: string;
                  picture?: string | null | undefined;
              }>;
          };
      }
    | null
    | undefined;
