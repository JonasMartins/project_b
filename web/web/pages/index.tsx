import type { NextPage } from "next";
import React from "react";
import { useMutation } from "@apollo/client";
import { LogoutDocument, LogoutMutation } from "generated/graphql";
import { useRouter } from "next/dist/client/router";
import Container from "components/Container";

const Home: NextPage = () => {
    const [logout, {}] = useMutation<LogoutMutation>(LogoutDocument);
    const router = useRouter();

    const handleLogout = async () => {
        const result = await logout();
        if (result.data?.logout) {
            router.push("/login");
        }
    };

    return (
        <Container>
            <h1>Logged!</h1>
            <button onClick={handleLogout}>Logout</button>
        </Container>
    );
};

export default Home;
