import type { NextPage } from "next";
import { useUser } from "utils/hooks/useUser";
import { useGetChatsLazyQuery } from "generated/graphql";
import { useCallback, useEffect, useState } from "react";
import { chats as chatsType } from "utils/types/chat/chat.types";
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import Container from "components/Container";
import NavBar from "components/Layout/NavBar";
import LeftPanel from "components/Layout/LeftPanel";
import Footer from "components/Layout/Footer";
import BeatLoaderCustom from "components/Layout/BeatLoaderCustom";
interface ChatProps {}

const Chat: NextPage<ChatProps> = () => {
    const user = useUser();
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.700" };
    const [getChats, resultGetChats] = useGetChatsLazyQuery({});
    const [chats, setChats] = useState<chatsType>([]);

    const handleGetChats = useCallback(async () => {
        if (user?.id) {
            const chats = await getChats({
                variables: {
                    participant: user.id,
                },
            });

            if (chats.data?.getChats?.chats) {
                setChats(chats.data.getChats.chats);
            }
        }
    }, [user?.id]);

    useEffect(() => {
        handleGetChats();
    }, [user?.id, resultGetChats.loading]);

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
                            {/* centro  */}
                        </GridItem>
                        <GridItem bg={bgColor[colorMode]} boxShadow="lg">
                            {/* 3 coluna  */}
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

    return resultGetChats.loading ? <BeatLoaderCustom /> : content;
};

export default Chat;
