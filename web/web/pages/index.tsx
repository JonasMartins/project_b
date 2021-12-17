import type { NextPage } from "next";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { LoginTestDocument, LoginTestQuery } from "generated/graphql";
import Spinner from "components/Layout/Spinner";
import { useRouter } from "next/dist/client/router";

const Home: NextPage = () => {
    const { loading, data } = useQuery<LoginTestQuery>(LoginTestDocument);

    const router = useRouter();

    useEffect(() => {
        if (!data?.loginTest) {
            router.push("/login");
        }
    }, [loading, data]);

    const content = <h1>Welcome</h1>;

    return loading ? <Spinner /> : content;
};

export default Home;
