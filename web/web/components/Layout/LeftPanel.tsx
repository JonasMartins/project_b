import React, { useEffect, useState } from "react";
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
interface LeftPanelProps {}

const gridCell = `
    display: flex;
    justify-content: center;
    align-items: center
`;

const LeftPanel: NextPage<LeftPanelProps> = ({}) => {
    const modalSettings = useDisclosure();
    const router = useRouter();

    const userConnections = useSelector(
        (state: RootState) => state.globalReducer.userConnections
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
    }, [hasUpdateUserSettings, userConnections, countUserInvitations]);

    return (
        <Box>
            <Grid templateRows="repeat(5,1fr)" templateColumns="repeat(3,1fr)">
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
                            onClick={() => {}}
                        />
                    </Tooltip>
                </GridItem>
                <GridItem css={css(gridCell)} />
            </Grid>
            <ModalSettings
                isOpen={modalSettings.isOpen}
                onClose={modalSettings.onClose}
            />
        </Box>
    );
};

export default LeftPanel;
