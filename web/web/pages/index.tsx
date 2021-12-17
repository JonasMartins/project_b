import type { NextPage } from "next";
import React from "react";
import { useQuery } from "@apollo/client";
import { LoginTestDocument, LoginTestQuery } from "generated/graphql";

const Home: NextPage = () => {
    const { loading, data } = useQuery<LoginTestQuery>(LoginTestDocument);

    console.log("loading ", loading);
    console.log("data ", data);

    return <h1>Hello World</h1>;
};

export default Home;
