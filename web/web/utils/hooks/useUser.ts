import {
    GetCurrentLoggedUserDocument,
    GetCurrentLoggedUserQuery,
} from "generated/graphql";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "Redux/Global/GlobalReducer";

export type UserType =
    | {
          __typename?: "User";
          id: string;
          name: string;
          email: string;
          password: string;
          picture?: string | null | undefined;
          role: { __typename?: "Role"; name: string };
      }
    | null
    | undefined;

export const useUser = () => {
    const { loading, data, error, refetch } =
        useQuery<GetCurrentLoggedUserQuery>(GetCurrentLoggedUserDocument, {
            fetchPolicy: "cache-and-network",
        });

    const hasUpdateUserSettings = useSelector(
        (state: RootState) => state.globalReducer.hasUpdateUserSettings
    );

    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        if (loading) return;

        if (error) {
            setUser(null);
        }

        setUser(data?.getCurrentLoggedUser.user);
    }, [loading]);

    useEffect(() => {
        if (hasUpdateUserSettings) {
            refetch();
        }
    }, [hasUpdateUserSettings]);

    return user;
};
