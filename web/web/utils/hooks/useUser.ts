import {
    GetCurrentLoggedUserDocument,
    GetCurrentLoggedUserQuery,
} from "generated/graphql";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

export type UserType =
    | {
          __typename?: "User";
          id: string;
          name: string;
          email: string;
          password: string;
          role: { __typename?: "Role"; name: string };
      }
    | null
    | undefined;

export const useUser = () => {
    const { loading, data, error } = useQuery<GetCurrentLoggedUserQuery>(
        GetCurrentLoggedUserDocument,
        { fetchPolicy: "cache-and-network" }
    );

    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        if (loading) return;

        if (error) {
            setUser(null);
        }

        setUser(data?.getCurrentLoggedUser.user);
    }, [loading]);

    return user;
};
