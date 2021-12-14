import { Box, Flex, Switch, useColorMode } from "@chakra-ui/react";
import type { NextPage } from "next";
import Image from "next/image";
import Logo from "public/images/techBlog_logo_5000x4710.png";
import React, { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import LoginForm from "components/Form/login.form";
interface Props {}

const Login: NextPage<Props> = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    const [shades, setShades] = useState(["#7928CA", "#FF0080"]);

    useEffect(() => {
        if (colorMode === "light") {
            setShades(["#6c23b5", "#d8006c"]);
        } else {
            setShades(["#311052", "#890045"]);
        }
    }, [colorMode]);

    return (
        <Flex
            bgGradient={`linear(to-l, ${shades[0]}, ${shades[1]} )`}
            flexDir="column"
            flexGrow={1}
            height="100vh"
        >
            <Flex justifyContent="flex-end" height={"10em"}>
                <Flex m={2}>
                    {colorMode === "light" ? (
                        <BsSun color="white" size="40px" />
                    ) : (
                        <BsMoon color="white" size="40px" />
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
            <Flex
                justifyContent="space-around"
                alignItems={"flex-start"}
                flexGrow={1}
                maxHeight="20em"
                mt={4}
            >
                <Box>
                    <Image
                        src={Logo}
                        alt="TechBlog"
                        width={"300px"}
                        height={"300px"}
                    />
                </Box>
                <Flex>
                    <Box
                        bg={colorMode === "dark" ? "grey.800" : "palePink"}
                        opacity={0.8}
                        boxShadow="xl"
                        p="6"
                        rounded="md"
                        padding={"2em"}
                        width={"20em"}
                        alignSelf="stretch"
                    >
                        <LoginForm />
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Login;
