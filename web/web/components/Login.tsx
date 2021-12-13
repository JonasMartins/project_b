import type { NextPage } from "next";
import { Text, Flex, Switch, useColorMode } from "@chakra-ui/react";
import Container from "components/Container";
import React from "react";
import { BsSun, BsMoon } from "react-icons/bs";

interface Props {}

const Login: NextPage<Props> = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Container>
            <Flex justifyContent="flex-end">
                <Flex m={2}>
                    {colorMode === "dark" ? (
                        <BsSun size="40px" />
                    ) : (
                        <BsMoon size="40px" />
                    )}
                </Flex>
                <Switch
                    colorScheme="purple"
                    size="lg"
                    id="changeColorMode"
                    onChange={toggleColorMode}
                    m={2}
                    p={2}
                />
            </Flex>
        </Container>
    );
};

export default Login;
