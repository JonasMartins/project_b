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
    const [delay, setDelay] = useState(true);
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

        if (!data?.loginTest) {
            handleRedirect();
        } else {
            setDelay(false);
        }
    }, [loading]);

    const content = <Flex direction="column">{children}</Flex>;

    return loading || delay ? <Spinner /> : content;
};

export default Container;
