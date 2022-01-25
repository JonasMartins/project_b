import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  body: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  parent?: Maybe<Comment>;
  post: Post;
  replies: Array<Comment>;
  updatedAt: Scalars['DateTime'];
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  comment?: Maybe<Comment>;
  errors?: Maybe<Array<ErrorFieldHandler>>;
};

export type CommentValidator = {
  authorId: Scalars['String'];
  body: Scalars['String'];
  postId: Scalars['String'];
};

export type CommentsResponse = {
  __typename?: 'CommentsResponse';
  comments?: Maybe<Array<Comment>>;
  errors?: Maybe<Array<ErrorFieldHandler>>;
};

export type Emotion = {
  __typename?: 'Emotion';
  createdAt: Scalars['DateTime'];
  creator: User;
  id: Scalars['String'];
  post: Post;
  type: EmotionType;
  updatedAt: Scalars['DateTime'];
};

export type EmotionDeletion = {
  __typename?: 'EmotionDeletion';
  deleted?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Array<ErrorFieldHandler>>;
};

export type EmotionResponse = {
  __typename?: 'EmotionResponse';
  emotion?: Maybe<Emotion>;
  errors?: Maybe<Array<ErrorFieldHandler>>;
};

/** The basic directions */
export enum EmotionType {
  Angry = 'ANGRY',
  Fire = 'FIRE',
  Heart = 'HEART',
  HeartEye = 'HEART_EYE',
  Prey = 'PREY',
  Sad = 'SAD',
  Smile = 'SMILE',
  SunGlass = 'SUN_GLASS',
  Surprise = 'SURPRISE',
  Thumbsdown = 'THUMBSDOWN',
  Thumbsup = 'THUMBSUP',
  Vomit = 'VOMIT'
}

export type EmotionsResponse = {
  __typename?: 'EmotionsResponse';
  emotions?: Maybe<Array<Emotion>>;
  errors?: Maybe<Array<ErrorFieldHandler>>;
};

export type ErrorFieldHandler = {
  __typename?: 'ErrorFieldHandler';
  detailedMessage: Scalars['String'];
  field: Scalars['String'];
  message: Scalars['String'];
  method: Scalars['String'];
};

export type GeneralResponse = {
  __typename?: 'GeneralResponse';
  done?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Array<ErrorFieldHandler>>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  token?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: CommentResponse;
  createConnection: GeneralResponse;
  createEmotion: EmotionResponse;
  createPost: PostResponse;
  createRequest: GeneralResponse;
  createRole: RoleResponse;
  createUser: UserResponse;
  deleteEmotion: EmotionDeletion;
  deleteEmotionFromPostByUser: EmotionDeletion;
  deleteRole: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  login: LoginResponse;
  logout: Scalars['Boolean'];
  updateEmotion: EmotionResponse;
  updateRequest: GeneralResponse;
  updateUserSettings: UserResponse;
};


export type MutationCreateCommentArgs = {
  options: CommentValidator;
};


export type MutationCreateConnectionArgs = {
  userRequestedId: Scalars['String'];
  userRequestorId: Scalars['String'];
};


export type MutationCreateEmotionArgs = {
  postId: Scalars['String'];
  type: EmotionType;
  userId: Scalars['String'];
};


export type MutationCreatePostArgs = {
  files?: InputMaybe<Array<Scalars['Upload']>>;
  options: PostValidator;
};


export type MutationCreateRequestArgs = {
  options: RequestValidator;
};


export type MutationCreateRoleArgs = {
  options: RoleValidator;
};


export type MutationCreateUserArgs = {
  options: UserValidator;
};


export type MutationDeleteEmotionArgs = {
  emotionId: Scalars['String'];
};


export type MutationDeleteEmotionFromPostByUserArgs = {
  postId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateEmotionArgs = {
  emotionId: Scalars['String'];
  newType: EmotionType;
};


export type MutationUpdateRequestArgs = {
  accepted: Scalars['Boolean'];
  requestId: Scalars['String'];
};


export type MutationUpdateUserSettingsArgs = {
  file?: InputMaybe<Scalars['Upload']>;
  id: Scalars['String'];
  options: UserValidator;
};

export type Post = {
  __typename?: 'Post';
  body: Scalars['String'];
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime'];
  creator: User;
  emotions?: Maybe<Array<Emotion>>;
  files?: Maybe<Array<Scalars['String']>>;
  id: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  post?: Maybe<Post>;
};

export type PostValidator = {
  body: Scalars['String'];
  creator_id: Scalars['String'];
};

export type PostsResponse = {
  __typename?: 'PostsResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  posts?: Maybe<Array<Post>>;
};

export type Query = {
  __typename?: 'Query';
  getCurrentLoggedUser: UserResponse;
  getEmotionsFromPost: EmotionsResponse;
  getEmotionsFromUser: EmotionsResponse;
  getPostComments: CommentsResponse;
  getPosts: PostsResponse;
  getRoleById: RoleResponse;
  getRoles: RolesResponse;
  getUserById: UserResponse;
  getUserConnections: UserResponse;
  getUsers: UsersResponse;
  loginTest: Scalars['Boolean'];
};


export type QueryGetEmotionsFromPostArgs = {
  postId: Scalars['String'];
};


export type QueryGetEmotionsFromUserArgs = {
  userId: Scalars['String'];
};


export type QueryGetPostCommentsArgs = {
  postId: Scalars['String'];
};


export type QueryGetPostsArgs = {
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
};


export type QueryGetRoleByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetRolesArgs = {
  limit?: InputMaybe<Scalars['Float']>;
};


export type QueryGetUsersArgs = {
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
};

export type Request = {
  __typename?: 'Request';
  accepted?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  requested: User;
  requestor: User;
  updatedAt: Scalars['DateTime'];
};

export type RequestValidator = {
  requestedId: Scalars['String'];
  requestorId: Scalars['String'];
};

export type Role = {
  __typename?: 'Role';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  users: Array<User>;
};

export type RoleResponse = {
  __typename?: 'RoleResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  role?: Maybe<Role>;
};

export type RoleValidator = {
  code: Scalars['String'];
  description: Scalars['String'];
  name: Scalars['String'];
};

export type RolesResponse = {
  __typename?: 'RolesResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  roles?: Maybe<Array<Role>>;
};

export type User = {
  __typename?: 'User';
  comments?: Maybe<Array<Comment>>;
  connections?: Maybe<Array<User>>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  emotions?: Maybe<Array<Emotion>>;
  id: Scalars['String'];
  invitations?: Maybe<Array<Request>>;
  name: Scalars['String'];
  password: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Post>>;
  requests?: Maybe<Array<Request>>;
  role: Role;
  updatedAt: Scalars['DateTime'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  user?: Maybe<User>;
};

export type UserValidator = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  picture?: InputMaybe<Scalars['String']>;
  roleId?: InputMaybe<Scalars['String']>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  users?: Maybe<Array<User>>;
};

export type CreateEmotionMutationVariables = Exact<{
  userId: Scalars['String'];
  postId: Scalars['String'];
  type: EmotionType;
}>;


export type CreateEmotionMutation = { __typename?: 'Mutation', createEmotion: { __typename?: 'EmotionResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, emotion?: { __typename?: 'Emotion', id: string, type: EmotionType, creator: { __typename?: 'User', id: string, name: string }, post: { __typename?: 'Post', id: string, body: string } } | null | undefined } };

export type CreatePostMutationVariables = Exact<{
  options: PostValidator;
  files?: InputMaybe<Array<Scalars['Upload']> | Scalars['Upload']>;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, post?: { __typename?: 'Post', id: string, body: string, files?: Array<string> | null | undefined, creator: { __typename?: 'User', id: string, name: string } } | null | undefined } };

export type CreateRoleMutationVariables = Exact<{
  options: RoleValidator;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'RoleResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, role?: { __typename?: 'Role', id: string, name: string, description: string } | null | undefined } };

export type CreateUserMutationVariables = Exact<{
  options: UserValidator;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, user?: { __typename?: 'User', id: string, name: string, email: string, password: string } | null | undefined } };

export type DeleteEmotionMutationVariables = Exact<{
  emotionId: Scalars['String'];
}>;


export type DeleteEmotionMutation = { __typename?: 'Mutation', deleteEmotion: { __typename?: 'EmotionDeletion', deleted?: boolean | null | undefined, errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, field: string, message: string }> | null | undefined } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token?: string | null | undefined, errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type UpdateRequestMutationVariables = Exact<{
  requestId: Scalars['String'];
  accepted: Scalars['Boolean'];
}>;


export type UpdateRequestMutation = { __typename?: 'Mutation', updateRequest: { __typename?: 'GeneralResponse', done?: boolean | null | undefined, errors?: Array<{ __typename?: 'ErrorFieldHandler', field: string, message: string, method: string }> | null | undefined } };

export type UpdateUserSettingsMutationVariables = Exact<{
  id: Scalars['String'];
  options: UserValidator;
  file?: InputMaybe<Scalars['Upload']>;
}>;


export type UpdateUserSettingsMutation = { __typename?: 'Mutation', updateUserSettings: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, user?: { __typename?: 'User', id: string, name: string, email: string, picture?: string | null | undefined } | null | undefined } };

export type GetCurrentLoggedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentLoggedUserQuery = { __typename?: 'Query', getCurrentLoggedUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: string, name: string, email: string, password: string, picture?: string | null | undefined, role: { __typename?: 'Role', id: string, name: string } } | null | undefined } };

export type GetPostsQueryVariables = Exact<{
  offset: Scalars['Float'];
  limit: Scalars['Float'];
}>;


export type GetPostsQuery = { __typename?: 'Query', getPosts: { __typename?: 'PostsResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string, method: string, field: string }> | null | undefined, posts?: Array<{ __typename?: 'Post', id: string, body: string, files?: Array<string> | null | undefined, creator: { __typename?: 'User', id: string, name: string }, emotions?: Array<{ __typename?: 'Emotion', id: string, type: EmotionType, creator: { __typename?: 'User', id: string, name: string } }> | null | undefined }> | null | undefined } };

export type GetUserConnectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserConnectionsQuery = { __typename?: 'Query', getUserConnections: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: string, name: string, email: string, connections?: Array<{ __typename?: 'User', id: string, name: string, picture?: string | null | undefined }> | null | undefined, invitations?: Array<{ __typename?: 'Request', id: string, accepted?: boolean | null | undefined, requestor: { __typename?: 'User', name: string, picture?: string | null | undefined } }> | null | undefined } | null | undefined } };

export type GetUsersQueryVariables = Exact<{
  offset: Scalars['Float'];
  limit: Scalars['Float'];
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: { __typename?: 'UsersResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string, method: string, field: string }> | null | undefined, users?: Array<{ __typename?: 'User', id: string, name: string, email: string, picture?: string | null | undefined, role: { __typename?: 'Role', id: string, name: string } }> | null | undefined } };

export type LoginTestQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginTestQuery = { __typename?: 'Query', loginTest: boolean };


export const CreateEmotionDocument = gql`
    mutation CreateEmotion($userId: String!, $postId: String!, $type: EmotionType!) {
  createEmotion(userId: $userId, postId: $postId, type: $type) {
    errors {
      method
      message
      field
    }
    emotion {
      id
      type
      creator {
        id
        name
      }
      post {
        id
        body
      }
    }
  }
}
    `;
export type CreateEmotionMutationFn = Apollo.MutationFunction<CreateEmotionMutation, CreateEmotionMutationVariables>;

/**
 * __useCreateEmotionMutation__
 *
 * To run a mutation, you first call `useCreateEmotionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmotionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmotionMutation, { data, loading, error }] = useCreateEmotionMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      postId: // value for 'postId'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useCreateEmotionMutation(baseOptions?: Apollo.MutationHookOptions<CreateEmotionMutation, CreateEmotionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEmotionMutation, CreateEmotionMutationVariables>(CreateEmotionDocument, options);
      }
export type CreateEmotionMutationHookResult = ReturnType<typeof useCreateEmotionMutation>;
export type CreateEmotionMutationResult = Apollo.MutationResult<CreateEmotionMutation>;
export type CreateEmotionMutationOptions = Apollo.BaseMutationOptions<CreateEmotionMutation, CreateEmotionMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($options: PostValidator!, $files: [Upload!]) {
  createPost(options: $options, files: $files) {
    errors {
      method
      message
      field
    }
    post {
      id
      body
      files
      creator {
        id
        name
      }
    }
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      options: // value for 'options'
 *      files: // value for 'files'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const CreateRoleDocument = gql`
    mutation CreateRole($options: RoleValidator!) {
  createRole(options: $options) {
    errors {
      method
      message
      field
    }
    role {
      id
      name
      description
    }
  }
}
    `;
export type CreateRoleMutationFn = Apollo.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoleMutation, { data, loading, error }] = useCreateRoleMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useCreateRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = Apollo.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = Apollo.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($options: UserValidator!) {
  createUser(options: $options) {
    errors {
      method
      message
      field
    }
    user {
      id
      name
      email
      password
    }
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteEmotionDocument = gql`
    mutation DeleteEmotion($emotionId: String!) {
  deleteEmotion(emotionId: $emotionId) {
    errors {
      method
      field
      message
    }
    deleted
  }
}
    `;
export type DeleteEmotionMutationFn = Apollo.MutationFunction<DeleteEmotionMutation, DeleteEmotionMutationVariables>;

/**
 * __useDeleteEmotionMutation__
 *
 * To run a mutation, you first call `useDeleteEmotionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEmotionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEmotionMutation, { data, loading, error }] = useDeleteEmotionMutation({
 *   variables: {
 *      emotionId: // value for 'emotionId'
 *   },
 * });
 */
export function useDeleteEmotionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEmotionMutation, DeleteEmotionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEmotionMutation, DeleteEmotionMutationVariables>(DeleteEmotionDocument, options);
      }
export type DeleteEmotionMutationHookResult = ReturnType<typeof useDeleteEmotionMutation>;
export type DeleteEmotionMutationResult = Apollo.MutationResult<DeleteEmotionMutation>;
export type DeleteEmotionMutationOptions = Apollo.BaseMutationOptions<DeleteEmotionMutation, DeleteEmotionMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      method
      message
      field
    }
    token
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const UpdateRequestDocument = gql`
    mutation UpdateRequest($requestId: String!, $accepted: Boolean!) {
  updateRequest(requestId: $requestId, accepted: $accepted) {
    errors {
      field
      message
      method
    }
    done
  }
}
    `;
export type UpdateRequestMutationFn = Apollo.MutationFunction<UpdateRequestMutation, UpdateRequestMutationVariables>;

/**
 * __useUpdateRequestMutation__
 *
 * To run a mutation, you first call `useUpdateRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRequestMutation, { data, loading, error }] = useUpdateRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      accepted: // value for 'accepted'
 *   },
 * });
 */
export function useUpdateRequestMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRequestMutation, UpdateRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRequestMutation, UpdateRequestMutationVariables>(UpdateRequestDocument, options);
      }
export type UpdateRequestMutationHookResult = ReturnType<typeof useUpdateRequestMutation>;
export type UpdateRequestMutationResult = Apollo.MutationResult<UpdateRequestMutation>;
export type UpdateRequestMutationOptions = Apollo.BaseMutationOptions<UpdateRequestMutation, UpdateRequestMutationVariables>;
export const UpdateUserSettingsDocument = gql`
    mutation UpdateUserSettings($id: String!, $options: UserValidator!, $file: Upload) {
  updateUserSettings(id: $id, options: $options, file: $file) {
    errors {
      method
      message
      field
    }
    user {
      id
      name
      email
      picture
    }
  }
}
    `;
export type UpdateUserSettingsMutationFn = Apollo.MutationFunction<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>;

/**
 * __useUpdateUserSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateUserSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserSettingsMutation, { data, loading, error }] = useUpdateUserSettingsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      options: // value for 'options'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUpdateUserSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>(UpdateUserSettingsDocument, options);
      }
export type UpdateUserSettingsMutationHookResult = ReturnType<typeof useUpdateUserSettingsMutation>;
export type UpdateUserSettingsMutationResult = Apollo.MutationResult<UpdateUserSettingsMutation>;
export type UpdateUserSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>;
export const GetCurrentLoggedUserDocument = gql`
    query GetCurrentLoggedUser {
  getCurrentLoggedUser {
    errors {
      method
      field
      message
    }
    user {
      id
      name
      email
      password
      picture
      role {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetCurrentLoggedUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentLoggedUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentLoggedUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentLoggedUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentLoggedUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentLoggedUserQuery, GetCurrentLoggedUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentLoggedUserQuery, GetCurrentLoggedUserQueryVariables>(GetCurrentLoggedUserDocument, options);
      }
export function useGetCurrentLoggedUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentLoggedUserQuery, GetCurrentLoggedUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentLoggedUserQuery, GetCurrentLoggedUserQueryVariables>(GetCurrentLoggedUserDocument, options);
        }
export type GetCurrentLoggedUserQueryHookResult = ReturnType<typeof useGetCurrentLoggedUserQuery>;
export type GetCurrentLoggedUserLazyQueryHookResult = ReturnType<typeof useGetCurrentLoggedUserLazyQuery>;
export type GetCurrentLoggedUserQueryResult = Apollo.QueryResult<GetCurrentLoggedUserQuery, GetCurrentLoggedUserQueryVariables>;
export const GetPostsDocument = gql`
    query GetPosts($offset: Float!, $limit: Float!) {
  getPosts(offset: $offset, limit: $limit) {
    errors {
      message
      method
      field
    }
    posts {
      id
      body
      files
      creator {
        id
        name
      }
      emotions {
        id
        type
        creator {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetPostsQuery(baseOptions: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
      }
export function useGetPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>;
export type GetPostsLazyQueryHookResult = ReturnType<typeof useGetPostsLazyQuery>;
export type GetPostsQueryResult = Apollo.QueryResult<GetPostsQuery, GetPostsQueryVariables>;
export const GetUserConnectionsDocument = gql`
    query GetUserConnections {
  getUserConnections {
    errors {
      method
      field
      message
    }
    user {
      id
      name
      email
      connections {
        id
        name
        picture
      }
      invitations {
        id
        accepted
        requestor {
          name
          picture
        }
      }
    }
  }
}
    `;

/**
 * __useGetUserConnectionsQuery__
 *
 * To run a query within a React component, call `useGetUserConnectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserConnectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserConnectionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserConnectionsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserConnectionsQuery, GetUserConnectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserConnectionsQuery, GetUserConnectionsQueryVariables>(GetUserConnectionsDocument, options);
      }
export function useGetUserConnectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserConnectionsQuery, GetUserConnectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserConnectionsQuery, GetUserConnectionsQueryVariables>(GetUserConnectionsDocument, options);
        }
export type GetUserConnectionsQueryHookResult = ReturnType<typeof useGetUserConnectionsQuery>;
export type GetUserConnectionsLazyQueryHookResult = ReturnType<typeof useGetUserConnectionsLazyQuery>;
export type GetUserConnectionsQueryResult = Apollo.QueryResult<GetUserConnectionsQuery, GetUserConnectionsQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers($offset: Float!, $limit: Float!) {
  getUsers(offset: $offset, limit: $limit) {
    errors {
      message
      method
      field
    }
    users {
      id
      name
      email
      picture
      role {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const LoginTestDocument = gql`
    query LoginTest {
  loginTest
}
    `;

/**
 * __useLoginTestQuery__
 *
 * To run a query within a React component, call `useLoginTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginTestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginTestQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoginTestQuery(baseOptions?: Apollo.QueryHookOptions<LoginTestQuery, LoginTestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginTestQuery, LoginTestQueryVariables>(LoginTestDocument, options);
      }
export function useLoginTestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginTestQuery, LoginTestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginTestQuery, LoginTestQueryVariables>(LoginTestDocument, options);
        }
export type LoginTestQueryHookResult = ReturnType<typeof useLoginTestQuery>;
export type LoginTestLazyQueryHookResult = ReturnType<typeof useLoginTestLazyQuery>;
export type LoginTestQueryResult = Apollo.QueryResult<LoginTestQuery, LoginTestQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    