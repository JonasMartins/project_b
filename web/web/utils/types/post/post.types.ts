export type getPostsType = {
    __typename?: "Post";
    id: string;
    body: string;
    files?: Array<string> | null | undefined;
    creator: { __typename?: "User"; id: string; name: string };
};
