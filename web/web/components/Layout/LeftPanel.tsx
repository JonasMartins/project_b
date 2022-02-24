import React, { useEffect } from "react";
import type { NextPage } from "next";
import {
    Tooltip,
    IconButton,
    useDisclosure,
    Circle,
    Box,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { IoIosSettings } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import {
    BsPeopleFill,
    BsFillBellFill,
    BsFillChatDotsFill,
} from "react-icons/bs";
import ModalSettings from "components/Modal/modalSettings";
import { useSelector } from "react-redux";
import { RootState } from "Redux/Global/GlobalReducer";
import { useRouter } from "next/dist/client/router";
import { css } from "@emotion/react";
import { FaUser } from "react-icons/fa";
import { useUser } from "utils/hooks/useUser";

interface LeftPanelProps {}

const gridCell = `
    display: flex;
    justify-content: center;
    align-items: center
`;

const LeftPanel: NextPage<LeftPanelProps> = ({}) => {
    const modalSettings = useDisclosure();
    const router = useRouter();
    const user = useUser();
    const userConnections = useSelector(
        (state: RootState) => state.globalReducer.userConnections
    );

    const countUserNewMessages = useSelector(
        (state: RootState) => state.globalReducer.countUserNewMessages
    );
    const hasUpdateUserSettings = useSelector(
        (state: RootState) => state.globalReducer.hasUpdateUserSettings
    );

    const countUserInvitations = useSelector(
        (state: RootState) => state.globalReducer.countUserInvitations
    );

    const handleCloseModalSettings = () => {
        if (hasUpdateUserSettings) {
            modalSettings.onClose();
        }
    };

    useEffect(() => {
        handleCloseModalSettings();
    }, [
        hasUpdateUserSettings,
        userConnections,
        countUserInvitations,
        countUserNewMessages,
    ]);

    return (
        <Box>
            <Grid templateRows="repeat(6,1fr)" templateColumns="repeat(3,1fr)">
                <GridItem />
                <GridItem css={css(gridCell)}>
                    <Tooltip
                        hasArrow
                        aria-label="home"
                        label="Home"
                        colorScheme="white"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="Home"
                            size="lg"
                            icon={<IoHome />}
                            onClick={() => {
                                router.push("/");
                            }}
                            mt={3}
                        />
                    </Tooltip>
                </GridItem>
                <GridItem css={css(gridCell)} />

                <GridItem />

                <GridItem css={css(gridCell)}>
                    <Tooltip
                        hasArrow
                        aria-label="My Profile"
                        label="My Profile"
                        colorScheme="white"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="My Profile"
                            size="lg"
                            icon={<FaUser />}
                            onClick={() => {
                                router.push(`/user/${user?.id}`);
                            }}
                            mt={3}
                        />
                    </Tooltip>
                </GridItem>
                <GridItem css={css(gridCell)} />

                <GridItem />

                <GridItem css={css(gridCell)}>
                    <Tooltip
                        hasArrow
                        aria-label="connections"
                        label="Connections"
                        colorScheme="white"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="Connections"
                            size="lg"
                            icon={<BsPeopleFill />}
                            onClick={() => {
                                router.push("/connections");
                            }}
                        />
                    </Tooltip>
                </GridItem>

                <GridItem css={css(gridCell)}>
                    {countUserInvitations ? (
                        <Circle size="25px" bg="red.400" color="white">
                            {countUserInvitations}
                        </Circle>
                    ) : (
                        <></>
                    )}
                </GridItem>

                <GridItem />
                <GridItem css={css(gridCell)}>
                    <Tooltip
                        hasArrow
                        aria-label="news"
                        label="News"
                        colorScheme="white"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="news"
                            size="lg"
                            icon={<BsFillBellFill />}
                            onClick={() => {}}
                        />
                    </Tooltip>
                </GridItem>
                <GridItem css={css(gridCell)} />

                <GridItem />
                <GridItem css={css(gridCell)}>
                    <Tooltip
                        hasArrow
                        aria-label="chats"
                        label="Chats"
                        colorScheme="white"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="chats"
                            size="lg"
                            icon={<BsFillChatDotsFill />}
                            onClick={() => {
                                router.push("/chat");
                            }}
                        />
                    </Tooltip>
                </GridItem>
                <GridItem css={css(gridCell)}>
                    {countUserNewMessages ? (
                        <Circle size="25px" bg="red.400" color="white">
                            {countUserNewMessages}
                        </Circle>
                    ) : (
                        <></>
                    )}
                </GridItem>
                <GridItem />

                <GridItem css={css(gridCell)}>
                    <Tooltip
                        hasArrow
                        aria-label="settings"
                        label="Seetings"
                        colorScheme="white"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="Settings"
                            size="lg"
                            icon={<IoIosSettings />}
                            onClick={() => {
                                modalSettings.onOpen();
                            }}
                        />
                    </Tooltip>
                </GridItem>
                <GridItem css={css(gridCell)} />

                <GridItem />
            </Grid>
            <ModalSettings
                isOpen={modalSettings.isOpen}
                onClose={modalSettings.onClose}
            />
        </Box>
    );
};

export default LeftPanel;
