import { useQuery } from "@apollo/client";
import { Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import { LoginTestDocument, LoginTestQuery } from "generated/graphql";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import Spinner from "components/Layout/Spinner";

interface ContainerProps {}

const Container: NextPage<ContainerProps> = ({ children }) => {
    const toast = useToast();
    const router = useRouter();
    const { data, loading } = useQuery<LoginTestQuery>(LoginTestDocument, {
        fetchPolicy: "network-only",
    });

    const handleRedirect = () => {
        router.push("/login");
        toast({
            title: "Access Denied",
            description: "You must be logged to access this page",
            status: "error",
            duration: 6000,
            isClosable: true,
            position: "bottom-right",
        });
    };

    useEffect(() => {
        if (loading) return;

        setTimeout(() => {
            console.log("data ", data?.loginTest);
            if (!data?.loginTest) {
                handleRedirect();
            } else {
                console.log("Logged");
            }
        }, 800);
    }, [loading]);

    const content = <Flex direction="column">{children}</Flex>;

    return loading ? <Spinner /> : content;
};

export default Container;
