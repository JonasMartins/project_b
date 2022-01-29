import {
    Box,
    Flex,
    Grid,
    GridItem,
    useColorMode,
    Text,
    Image,
    Tooltip,
    IconButton,
    useToast,
    Skeleton,
} from "@chakra-ui/react";
import Container from "components/Container";
import Footer from "components/Layout/Footer";
import LeftPanel from "components/Layout/LeftPanel";
import NavBar from "components/Layout/NavBar";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Invitations from "components/Invitations";
import { useSelector } from "react-redux";
import { RootState } from "Redux/Global/GlobalReducer";
import {
    useGetConnectionSuggestionsQuery,
    useCreateRequestMutation,
    CreateRequestMutation,
} from "generated/graphql";
import { defaultImage } from "utils/consts";
import { HiUserAdd } from "react-icons/hi";
import { truncateString } from "utils/generalAuxFunctions";

interface userSuggestionsType {
    __typename?: "User" | undefined;
    id: string;
    name: string;
    picture?: string | null | undefined;
}

const Connections: NextPage = () => {
    const toast = useToast();
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.700" };
    const [loadEffect, setLoadEffect] = useState(false);

    const [createRequest, resultCreateRequest] = useCreateRequestMutation({});

    const user = useSelector(
        (state: RootState) => state.globalReducer.userConnections
    );

    const suggestions = useGetConnectionSuggestionsQuery({
        fetchPolicy: "cache-and-network",
    });

    const [stateSuggestions, setStateSuggestions] = useState<
        Array<userSuggestionsType>
    >([]);

    const handleRemoveSuggestion = (u: userSuggestionsType) => {
        setTimeout(() => {
            if (stateSuggestions.length) {
                setStateSuggestions(
                    stateSuggestions.filter((x) => x.id !== u.id)
                );
            }
            toast({
                title: "Request Sended",
                description: "Request Successfully Sended",
                status: "success",
                duration: 8000,
                isClosable: true,
                position: "top",
            });
            setLoadEffect(false);
        }, 500);
    };

    const HandleCreateRequest = async (
        requestedId: string,
        requestorId: string
    ): Promise<CreateRequestMutation | null> => {
        const result = await createRequest({
            variables: {
                options: {
                    requestedId,
                    requestorId,
                },
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 8000,
                    isClosable: true,
                    position: "top",
                });
                console.error(resultCreateRequest.error);
            },
        });

        if (!result.data?.createRequest?.done) {
            return null;
        }

        return result.data;
    };

    useEffect(() => {
        if (suggestions.data?.getUserSuggestions.users) {
            setStateSuggestions([]);
            suggestions.data.getUserSuggestions.users.forEach((u) => {
                setStateSuggestions((prevSugg) => [...prevSugg, u]);
            });
        }
    }, [user, suggestions.loading]);

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
                            <Invitations />
                        </GridItem>
                        <GridItem bg={bgColor[colorMode]} boxShadow="lg">
                            <Flex flexDir="column">
                                <Flex justifyContent="center" p={2} m={2}>
                                    <Text fontWeight="thin" fontSize="2xl">
                                        Suggestions
                                    </Text>
                                </Flex>

                                {stateSuggestions.map((u) => (
                                    <Flex
                                        justifyContent="space-between"
                                        bgColor={
                                            colorMode === "dark"
                                                ? "grey.800"
                                                : "white"
                                        }
                                        boxShadow="md"
                                        p={3}
                                        m={3}
                                        alignItems="center"
                                        key={u.id}
                                    >
                                        <Skeleton isLoaded={!loadEffect}>
                                            <Flex alignItems="center">
                                                <Image
                                                    mr={2}
                                                    borderRadius="full"
                                                    boxSize="40px"
                                                    src={
                                                        u?.picture
                                                            ? u.picture
                                                            : defaultImage
                                                    }
                                                />
                                                <Text fontWeight="thin">
                                                    {truncateString(u?.name, 8)}
                                                </Text>
                                            </Flex>
                                        </Skeleton>
                                        <Flex p={2}>
                                            <Tooltip
                                                hasArrow
                                                aria-label="connect"
                                                label="Connect"
                                                colorScheme="white"
                                            >
                                                <IconButton
                                                    isRound={true}
                                                    aria-label="connect"
                                                    isDisabled={loadEffect}
                                                    icon={
                                                        <HiUserAdd color="teal" />
                                                    }
                                                    m={1}
                                                    onClick={() => {
                                                        if (
                                                            user
                                                                ?.getUserConnections
                                                                ?.user?.id
                                                        ) {
                                                            HandleCreateRequest(
                                                                u.id,
                                                                user
                                                                    .getUserConnections
                                                                    .user.id
                                                            );
                                                        }

                                                        setLoadEffect(true);
                                                        handleRemoveSuggestion(
                                                            u
                                                        );
                                                    }}
                                                />
                                            </Tooltip>
                                        </Flex>
                                    </Flex>
                                ))}
                            </Flex>
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

    return content;
};

export default Connections;
