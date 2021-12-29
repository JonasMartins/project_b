import {
    GetCurrentLoggedUserDocument,
    GetCurrentLoggedUserQuery,
} from "generated/graphql";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

type User =
    | {
          __typename?: "User";
          id: string;
          name: string;
          role: { __typename?: "Role"; name: string };
      }
    | null
    | undefined;

export const useUser = () => {
    const { loading, data, error } = useQuery<GetCurrentLoggedUserQuery>(
        GetCurrentLoggedUserDocument,
        { fetchPolicy: "cache-and-network" }
    );

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (loading) return;

        if (error) {
            setUser(null);
        }

        setUser(data?.getCurrentLoggedUser.user);
    }, [loading]);

    return user;
};
