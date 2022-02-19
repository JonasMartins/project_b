import { gql } from "@apollo/client";

export const GET_CHATS = gql`
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

export const MESSAGE_FRAGMENT = gql`
    fragment myMessage on Message {
        id
        body
        createdAt
        creator {
            id
            name
            picture
        }
    }
`;

export const GET_MESSAGES_FROM_CHAT = gql`
    query GetMessagesFromChat($chatId: String!) {
        getMessagesFromChat(chatId: $chatId) {
            messages {
                id
                body
                createdAt
            }
        }
    }
`;

export const ADD_MESSAGE_LOCAL_CACHE = gql`
    query GetChats($participant: String!) {
        getChats(participant: $participant) {
            chats {
                id
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
