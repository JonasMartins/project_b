import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    IconButton,
    Image,
    Link,
    Text,
    Tooltip,
    useColorMode,
} from "@chakra-ui/react";
import Container from "components/Container";
import Footer from "components/Layout/Footer";
import LeftPanel from "components/Layout/LeftPanel";
import NavBar from "components/Layout/NavBar";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import NexLink from "next/link";
import {
    useGetUserByIdLazyQuery,
    useGetUserConnectionsLazyQuery,
} from "generated/graphql";
import { userGetUserByIdType } from "utils/types/user/user.types";
import { getServerPathImage } from "utils/generalAuxFunctions";
import CentralFeedPost from "components/CentralFeedPost";
import { BsPeopleFill } from "react-icons/bs";
import { userConnectionType } from "utils/types/user/user.types";
import { AiOutlineEye } from "react-icons/ai";
import { HiOutlineUserAdd } from "react-icons/hi";

interface userPageProps {}

const UserPage: NextPage<userPageProps> = () => {
    const router = useRouter();
    const regexUuid =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    const { user } = router.query;
    const bgColor = { light: "gray.200", dark: "gray.700" };
    const { colorMode } = useColorMode();
    const [userData, setUserData] = useState<userGetUserByIdType>(null);
    const [getUserById, resultGetUserById] = useGetUserByIdLazyQuery({});
    const [connections, setConnections] = useState<Array<userConnectionType>>(
        []
    );
    const [getUserConnections, resultGetUserConnectionsLazy] =
        useGetUserConnectionsLazyQuery({});

    const handleGetUserInfo = useCallback(
        async (userId: string, postsOffset: number) => {
            if (!resultGetUserById.data || resultGetUserById.error) {
                const user_data = await getUserById({
                    variables: {
                        id: userId,
                        post_limit: 5,
                        post_offset: postsOffset,
                    },
                });

                if (user_data.data?.getUserById?.user) {
                    setUserData(user_data.data.getUserById.user);
                }
            }

            const conn = await getUserConnections({
                variables: {
                    id: userId,
                },
            });

            if (conn?.data?.getUserConnections) {
                setConnections([]);
                conn.data.getUserConnections.user?.connections?.forEach((x) => {
                    setConnections((prevConn) => [...prevConn, x]);
                });
            }
        },
        [user, resultGetUserById.data?.getUserById?.user?.id]
    );

    useEffect(() => {
        if (user && typeof user === "string" && regexUuid.test(user)) {
            handleGetUserInfo(user, 0);
        }
    }, [resultGetUserById.loading, resultGetUserConnectionsLazy.loading]);

    const content = (
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
                    >
                        <GridItem />
                        <GridItem bg={bgColor[colorMode]} boxShadow="lg">
                            <LeftPanel />
                        </GridItem>
                        <GridItem
                            colSpan={3}
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                        >
                            {userData && (
                                <React.Fragment>
                                    <Flex
                                        p={2}
                                        m={2}
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Flex alignItems="center">
                                            <Image
                                                src={getServerPathImage(
                                                    userData.picture
                                                )}
                                                borderRadius="full"
                                                boxSize="50px"
                                                mr={2}
                                            />

                                            <Text
                                                fontWeight="light"
                                                fontSize="lg"
                                            >
                                                {userData.name}
                                            </Text>
                                        </Flex>
                                        <Button
                                            leftIcon={<BsPeopleFill />}
                                            variant="solid"
                                            onClick={() => {
                                                // router.push("/connections");
                                            }}
                                        >
                                            Connect
                                        </Button>
                                    </Flex>
                                    <Flex p={2}>
                                        <Accordion allowToggle width="100%">
                                            <AccordionItem>
                                                <h2>
                                                    <AccordionButton>
                                                        <Box
                                                            flex="1"
                                                            textAlign="left"
                                                        >
                                                            <Flex alignItems="center">
                                                                <BsPeopleFill />
                                                                <Text
                                                                    ml={3}
                                                                    fontWeight="semibold"
                                                                >
                                                                    My
                                                                    Connections
                                                                </Text>
                                                            </Flex>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    {connections.map((x) => (
                                                        <Flex
                                                            alignItems="center"
                                                            justifyContent="space-between"
                                                        >
                                                            <Flex alignItems="center">
                                                                <Image
                                                                    mr={2}
                                                                    borderRadius="full"
                                                                    boxSize="50px"
                                                                    cursor="pointer"
                                                                    src={getServerPathImage(
                                                                        x.picture
                                                                    )}
                                                                />

                                                                <Text fontWeight="thin">
                                                                    {x.name}
                                                                </Text>
                                                            </Flex>
                                                            <Flex>
                                                                <Tooltip
                                                                    hasArrow
                                                                    aria-label="connect to this user"
                                                                    label="Connect"
                                                                >
                                                                    <IconButton
                                                                        isRound={
                                                                            true
                                                                        }
                                                                        aria-label="connect to this user"
                                                                        icon={
                                                                            <HiOutlineUserAdd />
                                                                        }
                                                                        mr={2}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip
                                                                    hasArrow
                                                                    aria-label="visit profile"
                                                                    label="Visit Profile"
                                                                >
                                                                    <IconButton
                                                                        isRound={
                                                                            true
                                                                        }
                                                                        aria-label="visit profile"
                                                                        icon={
                                                                            <AiOutlineEye />
                                                                        }
                                                                        onClick={() => {
                                                                            router.push(
                                                                                `/user/${x.id}`
                                                                            );
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            </Flex>
                                                        </Flex>
                                                    ))}
                                                </AccordionPanel>
                                            </AccordionItem>
                                        </Accordion>
                                    </Flex>
                                </React.Fragment>
                            )}
                            <Box mt={5} p={4}>
                                {userData?.posts?.map((x) => (
                                    <CentralFeedPost key={x.id} post={x} />
                                ))}
                            </Box>
                        </GridItem>
                        <GridItem
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                        ></GridItem>
                    </Grid>
                </Box>
                <Box>
                    <Footer />
                </Box>
            </Flex>
        </Container>
    );

    return resultGetUserById.loading || resultGetUserConnectionsLazy.loading ? (
        <Flex justifyContent="center" alignItems="center" minHeight="100vh">
            <BeatLoader color="3E10DFF" />
        </Flex>
    ) : (
        content
    );
};

export default UserPage;
