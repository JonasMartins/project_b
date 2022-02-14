import {
    Box,
    Flex,
    Grid,
    GridItem,
    Image,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import Container from "components/Container";
import Footer from "components/Layout/Footer";
import LeftPanel from "components/Layout/LeftPanel";
import NavBar from "components/Layout/NavBar";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { useGetUserByIdLazyQuery } from "generated/graphql";
import { userGetUserByIdType } from "utils/types/user/user.types";
import { getServerPathImage } from "utils/generalAuxFunctions";

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
        },
        [user, resultGetUserById.data?.getUserById?.user?.id]
    );

    useEffect(() => {
        if (user && typeof user === "string" && regexUuid.test(user)) {
            handleGetUserInfo(user, 0);
        }
    }, [resultGetUserById.loading]);

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
                                <Flex p={2} m={2}>
                                    <Image
                                        src={getServerPathImage(
                                            userData.picture
                                        )}
                                        borderRadius="full"
                                        boxSize="50px"
                                        mr={2}
                                    />

                                    <Text fontWeight="thin" fontSize="lg">
                                        {userData.name}
                                    </Text>
                                </Flex>
                            )}
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

    return resultGetUserById.loading ? (
        <Flex justifyContent="center" alignItems="center" minHeight="100vh">
            <BeatLoader color="3E10DFF" />
        </Flex>
    ) : (
        content
    );
};

export default UserPage;
