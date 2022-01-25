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
import { globalState } from "Redux/Global/GlobalReducer";
import { useRouter } from "next/dist/client/router";
import { setGetUserConnections } from "Redux/actions";
import { useDispatch } from "react-redux";
import { css } from "@emotion/react";
import {
    useGetUserConnectionsQuery,
    GetUserConnectionsQuery,
} from "generated/graphql";

interface LeftPanelProps {}

const gridCell = `
    display: flex;
    justify-content: center;
    align-items: center
`;

const LeftPanel: NextPage<LeftPanelProps> = ({}) => {
    const modalSettings = useDisclosure();
    const router = useRouter();
    const [userInvitations, setUserInvitatios] = useState(0);
    const dispatch = useDispatch();

    const onSetUserConnections = (user: GetUserConnectionsQuery | null) => {
        if (user) {
            dispatch(setGetUserConnections(user));
        }
    };

    const hasUpdateUserSettings = useSelector<
        globalState,
        globalState["hasUpdateUserSettings"]
    >((state) => state.hasUpdateUserSettings);

    const userConnections = useGetUserConnectionsQuery({
        fetchPolicy: "cache-and-network",
    });

    const handleCloseModalSettings = () => {
        if (hasUpdateUserSettings) {
            modalSettings.onClose();
        }
    };

    useEffect(() => {
        handleCloseModalSettings();
        if (userConnections.data) {
            onSetUserConnections(userConnections.data);
            let _invitations = 0;

            userConnections.data?.getUserConnections?.user?.invitations?.forEach(
                (item) => {
                    if (item.accepted === null || item.accepted === undefined) {
                        _invitations++;
                    }
                }
            );
            setUserInvitatios(_invitations);
        }
    }, [hasUpdateUserSettings, userConnections.loading]);

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
                    {userInvitations ? (
                        <Circle size="25px" bg="red.400" color="white">
                            {userInvitations}
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
