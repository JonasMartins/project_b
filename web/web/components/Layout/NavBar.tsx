import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
    Flex,
    useColorMode,
    Switch,
    Link,
    Box,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { BsMoon, BsSun } from "react-icons/bs";
import { AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import Image from "next/image";
import Logo from "public/images/techBlog_logo_1024x965.png";
import NexLink from "next/link";
import { customHamburgerMenu } from "utils/custom/customStyles";
import { css } from "@emotion/react";
import { useMutation } from "@apollo/client";
import { LogoutDocument, LogoutMutation } from "generated/graphql";
import { useRouter } from "next/dist/client/router";

interface NavBarProps {}

const NavBar: NextPage<NavBarProps> = ({}) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const [shades, setShades] = useState(["#7928CA", "#FF0080"]);

    const [logout, {}] = useMutation<LogoutMutation>(LogoutDocument);
    const router = useRouter();

    const handleLogout = async () => {
        const result = await logout();
        if (result.data?.logout) {
            router.push("/login");
        }
    };

    useEffect(() => {
        if (colorMode === "light") {
            setShades(["#6c23b5", "#d8006c"]);
        } else {
            setShades(["#311052", "#890045"]);
        }
    }, [colorMode]);

    return (
        <Flex
            flexGrow={1}
            bgGradient={`linear(to-l, ${shades[0]}, ${shades[1]} )`}
            justifyContent="space-between"
            m={0}
            overflow="hidden"
            boxShadow="lg"
        >
            <Flex
                padding={2}
                ml={2}
                justifyContent="flex-start"
                alignItems="center"
            >
                <NexLink href="/">
                    <Link>
                        <Image
                            src={Logo}
                            alt="TechBlog"
                            width={"48px"}
                            height={"46px"}
                        />
                    </Link>
                </NexLink>
                <Box ml={2}>
                    <NexLink href="/">
                        <Link color={"white"}>Home</Link>
                    </NexLink>
                </Box>
            </Flex>

            <Flex p={2} alignItems="center">
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
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<AiOutlineMenu color="white" />}
                        variant={`phlox-gradient-${colorMode}`}
                        css={css(customHamburgerMenu)}
                    />
                    <MenuList>
                        <MenuItem
                            icon={<AiOutlineLogout color="#e10dff" />}
                            onClick={handleLogout}
                        >
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    );
};
export default NavBar;
