import type { NextPage } from "next";
import Container from "components/Container";
import {
    Flex,
    Box,
    Grid,
    GridItem,
    useColorMode,
    Text,
    Image,
    Circle,
} from "@chakra-ui/react";
import Footer from "components/Layout/Footer";
import LeftPanel from "components/Layout/LeftPanel";
import NavBar from "components/Layout/NavBar";
import RightPanel from "components/Layout/RightPanel";
import { useGetUserNotificationsLazyQuery } from "generated/graphql";
import { useUser } from "utils/hooks/useUser";
import React, { useEffect, useState } from "react";
import { userNotificationsType } from "utils/types/user/user.types";
import BeatLoaderCustom from "components/Layout/BeatLoaderCustom";
import { formatRelative } from "date-fns";
import { getServerPathImage, truncateString } from "utils/generalAuxFunctions";
import { BsFillBellFill } from "react-icons/bs";

interface notificationsProps {}

const Notifications: NextPage = () => {
    const user = useUser();
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.700" };

    const [userNotifications, setUserNotifications] =
        useState<userNotificationsType>(null);
    const [getUserNotifications, resultGetUserNotifications] =
        useGetUserNotificationsLazyQuery({});

    const handlePageInfo = async () => {
        if (user?.id) {
            const news = await getUserNotifications({
                variables: {
                    userId: user.id,
                    offset: 0,
                    limit: 20,
                },
            });

            if (news.data?.getUserNotifications?.user) {
                setUserNotifications(news.data.getUserNotifications.user);
            }
        }
    };

    useEffect(() => {
        handlePageInfo();
    }, [user?.id]);

    return (
        <Container>
            <Flex
                flexDir="column"
                flexGrow={1}
                justifyContent="space-between"
                height="100vh"
            >
                <Box>
                    <NavBar />
                    <Grid
                        mt={10}
                        templateRows="repeat(1, 1fr)"
                        templateColumns="repeat(7, 1fr)"
                        gap={4}
                        borderRadius="1rem"
                    >
                        <GridItem />
                        <GridItem
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                            borderRadius="1rem"
                        >
                            <LeftPanel />{" "}
                        </GridItem>
                        <GridItem
                            colSpan={3}
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                            borderRadius="1rem"
                        >
                            {resultGetUserNotifications.loading ? (
                                <BeatLoaderCustom />
                            ) : (
                                userNotifications?.relatedNotifications?.map(
                                    (x) => (
                                        <Flex
                                            boxShadow="lg"
                                            p={4}
                                            m={4}
                                            borderRadius="1rem"
                                            flexDir="column"
                                            bgColor={
                                                colorMode === "dark"
                                                    ? "grey.800"
                                                    : "white"
                                            }
                                        >
                                            <Flex justifyContent="flex-end">
                                                <Circle
                                                    size="32px"
                                                    bg={
                                                        x.userSeen.includes(
                                                            user?.id || ""
                                                        )
                                                            ? "grey"
                                                            : "red"
                                                    }
                                                    color="white"
                                                    mr={4}
                                                >
                                                    <BsFillBellFill />
                                                </Circle>
                                            </Flex>
                                            <Text>
                                                {truncateString(
                                                    x.description,
                                                    10
                                                )}
                                            </Text>
                                            <Flex justifyContent="space-between">
                                                <Text
                                                    fontWeight="thin"
                                                    fontSize="sm"
                                                    textAlign="end"
                                                    mt={2}
                                                >
                                                    Created At:{" "}
                                                    {formatRelative(
                                                        new Date(x.createdAt),
                                                        new Date()
                                                    )}
                                                </Text>
                                                <Image
                                                    mr={4}
                                                    borderRadius="full"
                                                    boxSize="32px"
                                                    src={getServerPathImage(
                                                        x.creator.picture
                                                    )}
                                                />
                                            </Flex>
                                        </Flex>
                                    )
                                )
                            )}
                        </GridItem>
                        <GridItem
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                            borderRadius="1rem"
                        >
                            <RightPanel />
                        </GridItem>
                        <GridItem />
                    </Grid>
                </Box>
                <Box>
                    <Footer />
                </Box>
            </Flex>
        </Container>
    );
};

export default Notifications;
