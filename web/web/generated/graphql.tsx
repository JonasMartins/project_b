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
};

export type ErrorFieldHandler = {
  __typename?: 'ErrorFieldHandler';
  field: Scalars['String'];
  message: Scalars['String'];
  method: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  token?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createRole: RoleResponse;
  createUser: UserResponse;
  deleteRole: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  login: LoginResponse;
};


export type MutationCreateRoleArgs = {
  options: RoleValidator;
};


export type MutationCreateUserArgs = {
  options: UserValidator;
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

export type Query = {
  __typename?: 'Query';
  getRoleById: RoleResponse;
  getRoles: RolesResponse;
  getUserById: UserResponse;
  getUsers: UsersResponse;
  loginTest: Scalars['Boolean'];
};


export type QueryGetRoleByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetRolesArgs = {
  limit?: InputMaybe<Scalars['Float']>;
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetUsersArgs = {
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
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
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
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

export type CreateRoleMutationVariables = Exact<{
  options: RoleValidator;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'RoleResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, role?: { __typename?: 'Role', id: string, name: string, description: string } | null | undefined } };

export type CreateUserMutationVariables = Exact<{
  options: UserValidator;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined, user?: { __typename?: 'User', id: string, name: string, email: string, password: string } | null | undefined } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token?: string | null | undefined, errors?: Array<{ __typename?: 'ErrorFieldHandler', method: string, message: string, field: string }> | null | undefined } };

export type LoginTestQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginTestQuery = { __typename?: 'Query', loginTest: boolean };


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
    