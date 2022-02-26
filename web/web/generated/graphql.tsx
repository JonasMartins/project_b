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

export type Chat = {
  __typename?: 'Chat';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  messages?: Maybe<Array<Message>>;
  participants: Array<User>;
  updatedAt: Scalars['DateTime'];
};

export type ChatsResponse = {
  __typename?: 'ChatsResponse';
  chats?: Maybe<Array<Chat>>;
  errors?: Maybe<Array<ErrorFieldHandler>>;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  body: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  order: Scalars['Float'];
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

export type CountResponse = {
  __typename?: 'CountResponse';
  count?: Maybe<Scalars['Float']>;
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

export type Message = {
  __typename?: 'Message';
  body: Scalars['String'];
  chat: Chat;
  createdAt: Scalars['DateTime'];
  creator: User;
  id: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  userSeen: Array<Scalars['String']>;
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  message?: Maybe<Message>;
};

export type MessageSubscription = {
  __typename?: 'MessageSubscription';
  newMessage?: Maybe<Message>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMessageSeenByUser: GeneralResponse;
  createComment: CommentResponse;
  createConnection: GeneralResponse;
  createEmotion: EmotionResponse;
  createMessage: MessageResponse;
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
  updateUnSeenChat: GeneralResponse;
  updateUserSettings: UserResponse;
};


export type MutationAddMessageSeenByUserArgs = {
  messageId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationCreateCommentArgs = {
  options: CommentValidator;
  parentId?: InputMaybe<Scalars['String']>;
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


export type MutationCreateMessageArgs = {
  body: Scalars['String'];
  chatId?: InputMaybe<Scalars['String']>;
  creatorId: Scalars['String'];
  participants: Array<Scalars['String']>;
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


export type MutationUpdateUnSeenChatArgs = {
  chatId: Scalars['String'];
  userId: Scalars['String'];
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
  getChats: ChatsResponse;
  getCurrentLoggedUser: UserResponse;
  getEmotionsFromPost: EmotionsResponse;
  getEmotionsFromUser: EmotionsResponse;
  getPostById: PostResponse;
  getPostComments: CommentsResponse;
  getPosts: PostsResponse;
  getRoleById: RoleResponse;
  getRoles: RolesResponse;
  getUserById: UserResponse;
  getUserConnections: UserResponse;
  getUserPendingInvitationsCount: CountResponse;
  getUserSuggestions: UsersResponse;
  getUserUnseenMessages: UserResponse;
  getUsers: UsersResponse;
  loginTest: Scalars['Boolean'];
};


export type QueryGetChatsArgs = {
  participant: Scalars['String'];
};


export type QueryGetEmotionsFromPostArgs = {
  postId: Scalars['String'];
};


export type QueryGetEmotionsFromUserArgs = {
  userId: Scalars['String'];
};


export type QueryGetPostByIdArgs = {
  comment_limit?: InputMaybe<Scalars['Float']>;
  comment_offset?: InputMaybe<Scalars['Float']>;
  id: Scalars['String'];
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


export type QueryGetUserByIdArgs = {
  id: Scalars['String'];
  post_limit?: InputMaybe<Scalars['Float']>;
  post_offset?: InputMaybe<Scalars['Float']>;
};


export type QueryGetUserConnectionsArgs = {
  id: Scalars['String'];
};


export type QueryGetUserPendingInvitationsCountArgs = {
  id: Scalars['String'];
};


export type QueryGetUserUnseenMessagesArgs = {
  userId: Scalars['String'];
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

export type RequestSubscription = {
  __typename?: 'RequestSubscription';
  newRequest?: Maybe<Request>;
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

export type Subscription = {
  __typename?: 'Subscription';
  newMessageNotification: MessageSubscription;
  newRequestSubscription: RequestSubscription;
};

export type User = {
  __typename?: 'User';
  chats?: Maybe<Array<Chat>>;
  comments?: Maybe<Array<Comment>>;
  connections?: Maybe<Array<User>>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  emotions?: Maybe<Array<Emotion>>;
  id: Scalars['String'];
  invitations?: Maybe<Array<Request>>;
  lastSeen?: Maybe<Scalars['DateTime']>;
  lastTyped?: Maybe<Scalars['DateTime']>;
  messages: Message;
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

export type AddMessageSeenByUserMutationVariables = Exact<{
  userId: Scalars['String'];
  messageId: Scalars['String'];
}>;


export type AddMessageSeenByUserMutation = { __typename?: 'Mutation', addMessageSeenByUser: { __typename?: 'GeneralResponse', done?: boolean | null | undefined, errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string }> | null | undefined } };

export type CreateCommentMutationVariables = Exact<{
  options: CommentValidator;
  parentId?: InputMaybe<Scalars['String']>;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'CommentResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string }> | null | undefined, comment?: { __typename?: 'Comment', id: string, body: string, createdAt: any, author: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined } } | null | undefined } };

export type CreateConnectionMutationVariables = Exact<{
  userRequestedId: Scalars['String'];
  userRequestorId: Scalars['String'];
}>;


export type CreateConnectionMutation = { __typename?: 'Mutation', createConnection: { __typename?: 'GeneralResponse', done?: boolean | null | undefined, errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string, method: string, field: string }> | null | undefined } };

export type CreateEmotionMutationVariables = Exact<{
  userId: Scalars['String'];
  postId: Scalars['String'];
  type: EmotionType;
}>;


export type CreateEmotionMutation = { __typename?: 'Mutation', createEmotion: { __typename?: 'EmotionResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, emotion?: { __typename?: 'Emotion', id: string, type: EmotionType, creator: { __typename?: 'User', id: string, name: string }, post: { __typename?: 'Post', id: string } } | null | undefined } };

export type CreateMessageMutationVariables = Exact<{
  body: Scalars['String'];
  participants: Array<Scalars['String']> | Scalars['String'];
  creatorId: Scalars['String'];
  chatId?: InputMaybe<Scalars['String']>;
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'MessageResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string }> | null | undefined, message?: { __typename?: 'Message', id: string, body: string, createdAt: any, chat: { __typename?: 'Chat', id: string } } | null | undefined } };

export type CreatePostMutationVariables = Exact<{
  options: PostValidator;
  files?: InputMaybe<Array<Scalars['Upload']> | Scalars['Upload']>;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, post?: { __typename?: 'Post', id: string, body: string, files?: Array<string> | null | undefined, creator: { __typename?: 'User', id: string, name: string } } | null | undefined } };

export type CreateRequestMutationVariables = Exact<{
  options: RequestValidator;
}>;


export type CreateRequestMutation = { __typename?: 'Mutation', createRequest: { __typename?: 'GeneralResponse', done?: boolean | null | undefined, errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string, method: string, field: string }> | null | undefined } };

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

export type UpdateUnSeenChatMutationVariables = Exact<{
  chatId: Scalars['String'];
  userId: Scalars['String'];
}>;


export type UpdateUnSeenChatMutation = { __typename?: 'Mutation', updateUnSeenChat: { __typename?: 'GeneralResponse', done?: boolean | null | undefined, errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string }> | null | undefined } };

export type UpdateUserSettingsMutationVariables = Exact<{
  id: Scalars['String'];
  options: UserValidator;
  file?: InputMaybe<Scalars['Upload']>;
}>;


export type UpdateUserSettingsMutation = { __typename?: 'Mutation', updateUserSettings: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, user?: { __typename?: 'User', id: string, name: string, email: string, picture?: string | null | undefined } | null | undefined } };

export type GetChatsQueryVariables = Exact<{
  participant: Scalars['String'];
}>;


export type GetChatsQuery = { __typename?: 'Query', getChats: { __typename?: 'ChatsResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string }> | null | undefined, chats?: Array<{ __typename?: 'Chat', id: string, participants: Array<{ __typename?: 'User', id: string, name: string, picture?: string | null | undefined }>, messages?: Array<{ __typename?: 'Message', id: string, body: string, createdAt: any, creator: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined } }> | null | undefined }> | null | undefined } };

export type GetConnectionSuggestionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConnectionSuggestionsQuery = { __typename?: 'Query', getUserSuggestions: { __typename?: 'UsersResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', field: string, method: string, message: string }> | null | undefined, users?: Array<{ __typename?: 'User', id: string, name: string, picture?: string | null | undefined }> | null | undefined } };

export type GetCurrentLoggedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentLoggedUserQuery = { __typename?: 'Query', getCurrentLoggedUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: string, name: string, email: string, password: string, picture?: string | null | undefined, role: { __typename?: 'Role', id: string, name: string }, connections?: Array<{ __typename?: 'User', id: string }> | null | undefined } | null | undefined } };

export type GetPostsQueryVariables = Exact<{
  offset: Scalars['Float'];
  limit: Scalars['Float'];
}>;


export type GetPostsQuery = { __typename?: 'Query', getPosts: { __typename?: 'PostsResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string, method: string, field: string }> | null | undefined, posts?: Array<{ __typename?: 'Post', id: string, body: string, files?: Array<string> | null | undefined, createdAt: any, creator: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined }, emotions?: Array<{ __typename?: 'Emotion', id: string, type: EmotionType, creator: { __typename?: 'User', id: string, name: string } }> | null | undefined, comments?: Array<{ __typename?: 'Comment', id: string, body: string, order: number, createdAt: any, author: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined }, replies: Array<{ __typename?: 'Comment', id: string, body: string, createdAt: any, author: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined } }> }> | null | undefined }> | null | undefined } };

export type GetUserByIdQueryVariables = Exact<{
  post_limit?: InputMaybe<Scalars['Float']>;
  post_offset?: InputMaybe<Scalars['Float']>;
  id: Scalars['String'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string, field: string, method: string }> | null | undefined, user?: { __typename?: 'User', id: string, name: string, email: string, picture?: string | null | undefined, connections?: Array<{ __typename?: 'User', id: string, name: string, picture?: string | null | undefined }> | null | undefined, posts?: Array<{ __typename?: 'Post', id: string, body: string, files?: Array<string> | null | undefined, createdAt: any, creator: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined }, emotions?: Array<{ __typename?: 'Emotion', id: string, type: EmotionType, creator: { __typename?: 'User', id: string, name: string } }> | null | undefined, comments?: Array<{ __typename?: 'Comment', id: string, body: string, createdAt: any, order: number, author: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined }, replies: Array<{ __typename?: 'Comment', id: string, body: string, createdAt: any, author: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined } }> }> | null | undefined }> | null | undefined } | null | undefined } };

export type GetUserConnectionsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetUserConnectionsQuery = { __typename?: 'Query', getUserConnections: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: string, name: string, email: string, connections?: Array<{ __typename?: 'User', id: string, name: string, picture?: string | null | undefined }> | null | undefined, invitations?: Array<{ __typename?: 'Request', id: string, accepted?: boolean | null | undefined, requestor: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined } }> | null | undefined } | null | undefined } };

export type GetUserPendingInvitationsCountQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetUserPendingInvitationsCountQuery = { __typename?: 'Query', getUserPendingInvitationsCount: { __typename?: 'CountResponse', count?: number | null | undefined, errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string, method: string, field: string }> | null | undefined } };

export type GetUserUnseenMessagesQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetUserUnseenMessagesQuery = { __typename?: 'Query', getUserUnseenMessages: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string }> | null | undefined, user?: { __typename?: 'User', id: string, chats?: Array<{ __typename?: 'Chat', id: string, messages?: Array<{ __typename?: 'Message', id: string, userSeen: Array<string> }> | null | undefined }> | null | undefined } | null | undefined } };

export type GetUsersQueryVariables = Exact<{
  offset: Scalars['Float'];
  limit: Scalars['Float'];
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: { __typename?: 'UsersResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', message: string, method: string, field: string }> | null | undefined, users?: Array<{ __typename?: 'User', id: string, name: string, email: string, picture?: string | null | undefined, role: { __typename?: 'Role', id: string, name: string } }> | null | undefined } };

export type LoginTestQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginTestQuery = { __typename?: 'Query', loginTest: boolean };

export type NewMessageNotificationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMessageNotificationSubscription = { __typename?: 'Subscription', newMessageNotification: { __typename?: 'MessageSubscription', newMessage?: { __typename?: 'Message', id: string, body: string, createdAt: any, userSeen: Array<string>, creator: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined }, chat: { __typename?: 'Chat', id: string, participants: Array<{ __typename?: 'User', id: string, name: string, picture?: string | null | undefined }> } } | null | undefined } };

export type NewRequestSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewRequestSubscriptionSubscription = { __typename?: 'Subscription', newRequestSubscription: { __typename?: 'RequestSubscription', newRequest?: { __typename?: 'Request', id: string, requestor: { __typename?: 'User', id: string, name: string, picture?: string | null | undefined }, requested: { __typename?: 'User', id: string } } | null | undefined } };


export const AddMessageSeenByUserDocument = gql`
    mutation AddMessageSeenByUser($userId: String!, $messageId: String!) {
  addMessageSeenByUser(userId: $userId, messageId: $messageId) {
    errors {
      message
    }
    done
  }
}
    `;
export type AddMessageSeenByUserMutationFn = Apollo.MutationFunction<AddMessageSeenByUserMutation, AddMessageSeenByUserMutationVariables>;

/**
 * __useAddMessageSeenByUserMutation__
 *
 * To run a mutation, you first call `useAddMessageSeenByUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageSeenByUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageSeenByUserMutation, { data, loading, error }] = useAddMessageSeenByUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useAddMessageSeenByUserMutation(baseOptions?: Apollo.MutationHookOptions<AddMessageSeenByUserMutation, AddMessageSeenByUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMessageSeenByUserMutation, AddMessageSeenByUserMutationVariables>(AddMessageSeenByUserDocument, options);
      }
export type AddMessageSeenByUserMutationHookResult = ReturnType<typeof useAddMessageSeenByUserMutation>;
export type AddMessageSeenByUserMutationResult = Apollo.MutationResult<AddMessageSeenByUserMutation>;
export type AddMessageSeenByUserMutationOptions = Apollo.BaseMutationOptions<AddMessageSeenByUserMutation, AddMessageSeenByUserMutationVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($options: CommentValidator!, $parentId: String) {
  createComment(options: $options, parentId: $parentId) {
    errors {
      message
    }
    comment {
      id
      body
      createdAt
      author {
        id
        name
        picture
      }
    }
  }
}
    `;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      options: // value for 'options'
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreateConnectionDocument = gql`
    mutation CreateConnection($userRequestedId: String!, $userRequestorId: String!) {
  createConnection(
    userRequestedId: $userRequestedId
    userRequestorId: $userRequestorId
  ) {
    errors {
      message
      method
      field
    }
    done
  }
}
    `;
export type CreateConnectionMutationFn = Apollo.MutationFunction<CreateConnectionMutation, CreateConnectionMutationVariables>;

/**
 * __useCreateConnectionMutation__
 *
 * To run a mutation, you first call `useCreateConnectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConnectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConnectionMutation, { data, loading, error }] = useCreateConnectionMutation({
 *   variables: {
 *      userRequestedId: // value for 'userRequestedId'
 *      userRequestorId: // value for 'userRequestorId'
 *   },
 * });
 */
export function useCreateConnectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateConnectionMutation, CreateConnectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConnectionMutation, CreateConnectionMutationVariables>(CreateConnectionDocument, options);
      }
export type CreateConnectionMutationHookResult = ReturnType<typeof useCreateConnectionMutation>;
export type CreateConnectionMutationResult = Apollo.MutationResult<CreateConnectionMutation>;
export type CreateConnectionMutationOptions = Apollo.BaseMutationOptions<CreateConnectionMutation, CreateConnectionMutationVariables>;
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
export const CreateMessageDocument = gql`
    mutation CreateMessage($body: String!, $participants: [String!]!, $creatorId: String!, $chatId: String) {
  createMessage(
    body: $body
    participants: $participants
    creatorId: $creatorId
    chatId: $chatId
  ) {
    errors {
      message
    }
    message {
      id
      body
      createdAt
      chat {
        id
      }
    }
  }
}
    `;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      body: // value for 'body'
 *      participants: // value for 'participants'
 *      creatorId: // value for 'creatorId'
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
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
export const CreateRequestDocument = gql`
    mutation CreateRequest($options: RequestValidator!) {
  createRequest(options: $options) {
    errors {
      message
      method
      field
    }
    done
  }
}
    `;
export type CreateRequestMutationFn = Apollo.MutationFunction<CreateRequestMutation, CreateRequestMutationVariables>;

/**
 * __useCreateRequestMutation__
 *
 * To run a mutation, you first call `useCreateRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRequestMutation, { data, loading, error }] = useCreateRequestMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useCreateRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateRequestMutation, CreateRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRequestMutation, CreateRequestMutationVariables>(CreateRequestDocument, options);
      }
export type CreateRequestMutationHookResult = ReturnType<typeof useCreateRequestMutation>;
export type CreateRequestMutationResult = Apollo.MutationResult<CreateRequestMutation>;
export type CreateRequestMutationOptions = Apollo.BaseMutationOptions<CreateRequestMutation, CreateRequestMutationVariables>;
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
export const UpdateUnSeenChatDocument = gql`
    mutation UpdateUnSeenChat($chatId: String!, $userId: String!) {
  updateUnSeenChat(chatId: $chatId, userId: $userId) {
    errors {
      message
    }
    done
  }
}
    `;
export type UpdateUnSeenChatMutationFn = Apollo.MutationFunction<UpdateUnSeenChatMutation, UpdateUnSeenChatMutationVariables>;

/**
 * __useUpdateUnSeenChatMutation__
 *
 * To run a mutation, you first call `useUpdateUnSeenChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUnSeenChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUnSeenChatMutation, { data, loading, error }] = useUpdateUnSeenChatMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUpdateUnSeenChatMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUnSeenChatMutation, UpdateUnSeenChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUnSeenChatMutation, UpdateUnSeenChatMutationVariables>(UpdateUnSeenChatDocument, options);
      }
export type UpdateUnSeenChatMutationHookResult = ReturnType<typeof useUpdateUnSeenChatMutation>;
export type UpdateUnSeenChatMutationResult = Apollo.MutationResult<UpdateUnSeenChatMutation>;
export type UpdateUnSeenChatMutationOptions = Apollo.BaseMutationOptions<UpdateUnSeenChatMutation, UpdateUnSeenChatMutationVariables>;
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
export const GetChatsDocument = gql`
    query GetChats($participant: String!) {
  getChats(participant: $participant) {
    errors {
      message
    }
    chats {
      id
      participants {
        id
        name
        picture
      }
      messages {
        id
        body
        createdAt
        creator {
          id
          name
          picture
        }
      }
    }
  }
}
    `;

/**
 * __useGetChatsQuery__
 *
 * To run a query within a React component, call `useGetChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatsQuery({
 *   variables: {
 *      participant: // value for 'participant'
 *   },
 * });
 */
export function useGetChatsQuery(baseOptions: Apollo.QueryHookOptions<GetChatsQuery, GetChatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatsQuery, GetChatsQueryVariables>(GetChatsDocument, options);
      }
export function useGetChatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatsQuery, GetChatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatsQuery, GetChatsQueryVariables>(GetChatsDocument, options);
        }
export type GetChatsQueryHookResult = ReturnType<typeof useGetChatsQuery>;
export type GetChatsLazyQueryHookResult = ReturnType<typeof useGetChatsLazyQuery>;
export type GetChatsQueryResult = Apollo.QueryResult<GetChatsQuery, GetChatsQueryVariables>;
export const GetConnectionSuggestionsDocument = gql`
    query GetConnectionSuggestions {
  getUserSuggestions {
    errors {
      field
      method
      message
    }
    users {
      id
      name
      picture
    }
  }
}
    `;

/**
 * __useGetConnectionSuggestionsQuery__
 *
 * To run a query within a React component, call `useGetConnectionSuggestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConnectionSuggestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConnectionSuggestionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetConnectionSuggestionsQuery(baseOptions?: Apollo.QueryHookOptions<GetConnectionSuggestionsQuery, GetConnectionSuggestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConnectionSuggestionsQuery, GetConnectionSuggestionsQueryVariables>(GetConnectionSuggestionsDocument, options);
      }
export function useGetConnectionSuggestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConnectionSuggestionsQuery, GetConnectionSuggestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConnectionSuggestionsQuery, GetConnectionSuggestionsQueryVariables>(GetConnectionSuggestionsDocument, options);
        }
export type GetConnectionSuggestionsQueryHookResult = ReturnType<typeof useGetConnectionSuggestionsQuery>;
export type GetConnectionSuggestionsLazyQueryHookResult = ReturnType<typeof useGetConnectionSuggestionsLazyQuery>;
export type GetConnectionSuggestionsQueryResult = Apollo.QueryResult<GetConnectionSuggestionsQuery, GetConnectionSuggestionsQueryVariables>;
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
      connections {
        id
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
      createdAt
      creator {
        id
        name
        picture
      }
      emotions {
        id
        type
        creator {
          id
          name
        }
      }
      comments {
        id
        body
        order
        createdAt
        author {
          id
          name
          picture
        }
        replies {
          id
          body
          createdAt
          author {
            id
            name
            picture
          }
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
export const GetUserByIdDocument = gql`
    query GetUserById($post_limit: Float, $post_offset: Float, $id: String!) {
  getUserById(post_limit: $post_limit, post_offset: $post_offset, id: $id) {
    errors {
      message
      field
      method
    }
    user {
      id
      name
      email
      picture
      connections {
        id
        name
        picture
      }
      posts {
        id
        body
        files
        createdAt
        creator {
          id
          name
          picture
        }
        emotions {
          id
          type
          creator {
            id
            name
          }
        }
        comments {
          id
          body
          createdAt
          order
          author {
            id
            name
            picture
          }
          replies {
            id
            body
            createdAt
            author {
              id
              name
              picture
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      post_limit: // value for 'post_limit'
 *      post_offset: // value for 'post_offset'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
      }
export function useGetUserByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdQueryResult = Apollo.QueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetUserConnectionsDocument = gql`
    query GetUserConnections($id: String!) {
  getUserConnections(id: $id) {
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
          id
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserConnectionsQuery(baseOptions: Apollo.QueryHookOptions<GetUserConnectionsQuery, GetUserConnectionsQueryVariables>) {
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
export const GetUserPendingInvitationsCountDocument = gql`
    query GetUserPendingInvitationsCount($id: String!) {
  getUserPendingInvitationsCount(id: $id) {
    errors {
      message
      method
      field
    }
    count
  }
}
    `;

/**
 * __useGetUserPendingInvitationsCountQuery__
 *
 * To run a query within a React component, call `useGetUserPendingInvitationsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPendingInvitationsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPendingInvitationsCountQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserPendingInvitationsCountQuery(baseOptions: Apollo.QueryHookOptions<GetUserPendingInvitationsCountQuery, GetUserPendingInvitationsCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPendingInvitationsCountQuery, GetUserPendingInvitationsCountQueryVariables>(GetUserPendingInvitationsCountDocument, options);
      }
export function useGetUserPendingInvitationsCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPendingInvitationsCountQuery, GetUserPendingInvitationsCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPendingInvitationsCountQuery, GetUserPendingInvitationsCountQueryVariables>(GetUserPendingInvitationsCountDocument, options);
        }
export type GetUserPendingInvitationsCountQueryHookResult = ReturnType<typeof useGetUserPendingInvitationsCountQuery>;
export type GetUserPendingInvitationsCountLazyQueryHookResult = ReturnType<typeof useGetUserPendingInvitationsCountLazyQuery>;
export type GetUserPendingInvitationsCountQueryResult = Apollo.QueryResult<GetUserPendingInvitationsCountQuery, GetUserPendingInvitationsCountQueryVariables>;
export const GetUserUnseenMessagesDocument = gql`
    query GetUserUnseenMessages($userId: String!) {
  getUserUnseenMessages(userId: $userId) {
    errors {
      message
    }
    user {
      id
      chats {
        id
        messages {
          id
          userSeen
        }
      }
    }
  }
}
    `;

/**
 * __useGetUserUnseenMessagesQuery__
 *
 * To run a query within a React component, call `useGetUserUnseenMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserUnseenMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserUnseenMessagesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserUnseenMessagesQuery(baseOptions: Apollo.QueryHookOptions<GetUserUnseenMessagesQuery, GetUserUnseenMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserUnseenMessagesQuery, GetUserUnseenMessagesQueryVariables>(GetUserUnseenMessagesDocument, options);
      }
export function useGetUserUnseenMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserUnseenMessagesQuery, GetUserUnseenMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserUnseenMessagesQuery, GetUserUnseenMessagesQueryVariables>(GetUserUnseenMessagesDocument, options);
        }
export type GetUserUnseenMessagesQueryHookResult = ReturnType<typeof useGetUserUnseenMessagesQuery>;
export type GetUserUnseenMessagesLazyQueryHookResult = ReturnType<typeof useGetUserUnseenMessagesLazyQuery>;
export type GetUserUnseenMessagesQueryResult = Apollo.QueryResult<GetUserUnseenMessagesQuery, GetUserUnseenMessagesQueryVariables>;
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
export const NewMessageNotificationDocument = gql`
    subscription NewMessageNotification {
  newMessageNotification {
    newMessage {
      id
      body
      createdAt
      userSeen
      creator {
        id
        name
        picture
      }
      chat {
        id
        participants {
          id
          name
          picture
        }
      }
    }
  }
}
    `;

/**
 * __useNewMessageNotificationSubscription__
 *
 * To run a query within a React component, call `useNewMessageNotificationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageNotificationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageNotificationSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewMessageNotificationSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewMessageNotificationSubscription, NewMessageNotificationSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewMessageNotificationSubscription, NewMessageNotificationSubscriptionVariables>(NewMessageNotificationDocument, options);
      }
export type NewMessageNotificationSubscriptionHookResult = ReturnType<typeof useNewMessageNotificationSubscription>;
export type NewMessageNotificationSubscriptionResult = Apollo.SubscriptionResult<NewMessageNotificationSubscription>;
export const NewRequestSubscriptionDocument = gql`
    subscription NewRequestSubscription {
  newRequestSubscription {
    newRequest {
      id
      requestor {
        id
        name
        picture
      }
      requested {
        id
      }
    }
  }
}
    `;

/**
 * __useNewRequestSubscriptionSubscription__
 *
 * To run a query within a React component, call `useNewRequestSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewRequestSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewRequestSubscriptionSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewRequestSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewRequestSubscriptionSubscription, NewRequestSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewRequestSubscriptionSubscription, NewRequestSubscriptionSubscriptionVariables>(NewRequestSubscriptionDocument, options);
      }
export type NewRequestSubscriptionSubscriptionHookResult = ReturnType<typeof useNewRequestSubscriptionSubscription>;
export type NewRequestSubscriptionSubscriptionResult = Apollo.SubscriptionResult<NewRequestSubscriptionSubscription>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    