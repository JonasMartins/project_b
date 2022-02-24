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
    Skeleton,
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
import { useUser } from "utils/hooks/useUser";

interface userPageProps {}

const UserPage: NextPage<userPageProps> = () => {
    const router = useRouter();
    const regexUuid =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    const { user } = router.query;
    const loggedUser = useUser();
    const bgColor = { light: "gray.200", dark: "gray.700" };
    const { colorMode } = useColorMode();
    const [userData, setUserData] = useState<userGetUserByIdType>(null);
    const [getUserById, resultGetUserById] = useGetUserByIdLazyQuery({});
    const [loadEffect, setLoadEffect] = useState(false);
    const [connections, setConnections] = useState<Array<userConnectionType>>(
        []
    );
    const [getUserConnections, resultGetUserConnectionsLazy] =
        useGetUserConnectionsLazyQuery({});

    const handleGetUserInfo = useCallback(
        async (userId: string, postsOffset: number) => {
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
        [
            user,
            resultGetUserById.data?.getUserById?.user?.id,
            resultGetUserConnectionsLazy.data?.getUserConnections?.user?.id,
        ]
    );

    const checkIfLoggedUserCanConnectToUser = (): boolean => {
        if (loggedUser?.id === user) {
            return false;
        }

        let canConnect = true;

        connections.forEach((x) => {
            if (loggedUser?.id === x.id) {
                canConnect = false;
            }
        });

        return canConnect;
    };

    useEffect(() => {
        setLoadEffect(true);
        if (user && typeof user === "string" && regexUuid.test(user)) {
            handleGetUserInfo(user, 0);
        }
        let load = setTimeout(() => {
            setLoadEffect(false);
        }, 500);

        return () => {
            clearTimeout(load);
        };
    }, [
        user,
        resultGetUserById.loading,
        resultGetUserConnectionsLazy.loading,
        loggedUser?.id,
    ]);

    useEffect(() => {
        return () => {
            setUserData(null);
            setConnections([]);
        };
    }, []);

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
                                    <Skeleton isLoaded={!loadEffect}>
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
                                            {checkIfLoggedUserCanConnectToUser() ? (
                                                <Button
                                                    leftIcon={<BsPeopleFill />}
                                                    variant="solid"
                                                    onClick={() => {
                                                        // router.push("/connections");
                                                    }}
                                                >
                                                    Connect
                                                </Button>
                                            ) : (
                                                <></>
                                            )}
                                        </Flex>
                                    </Skeleton>
                                </React.Fragment>
                            )}
                            <Box mt={5} p={4}>
                                {userData?.posts?.map((x) => (
                                    <Skeleton isLoaded={!loadEffect}>
                                        <CentralFeedPost key={x.id} post={x} />
                                    </Skeleton>
                                ))}
                            </Box>
                        </GridItem>
                        <GridItem bg={bgColor[colorMode]} boxShadow="lg">
                            <Skeleton isLoaded={!loadEffect}>
                                <Flex p={2} flexDir="column">
                                    <Text
                                        fontWeight="light"
                                        mb={4}
                                        textAlign="center"
                                    >{`${userData?.name}'s connections`}</Text>
                                    {connections &&
                                        connections.map((x) => (
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
                                                        aria-label="visit profile"
                                                        label="Visit Profile"
                                                    >
                                                        <IconButton
                                                            isRound={true}
                                                            aria-label="visit profile"
                                                            icon={
                                                                <AiOutlineEye />
                                                            }
                                                            onClick={() => {
                                                                router.push(
                                                                    `/user/${x.id}`
                                                                );

                                                                handleGetUserInfo(
                                                                    x.id,
                                                                    0
                                                                );
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </Flex>
                                            </Flex>
                                        ))}
                                </Flex>
                            </Skeleton>
                        </GridItem>
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
