import React, { useEffect } from "react";
import type { NextPage } from "next";
import { Flex, Tooltip, IconButton, useDisclosure } from "@chakra-ui/react";
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

interface LeftPanelProps {}

const LeftPanel: NextPage<LeftPanelProps> = ({}) => {
    const modalSettings = useDisclosure();
    const router = useRouter();

    const hasUpdateUserSettings = useSelector<
        globalState,
        globalState["hasUpdateUserSettings"]
    >((state) => state.hasUpdateUserSettings);

    const handleCloseModalSettings = () => {
        if (hasUpdateUserSettings) {
            modalSettings.onClose();
        }
    };

    useEffect(() => {
        handleCloseModalSettings();
    }, [hasUpdateUserSettings]);

    return (
        <Flex flexGrow={1} flexDir="column" m={5} alignItems="center">
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
            <Tooltip
                hasArrow
                aria-label="settings"
                label="Seetings"
                colorScheme="white"
            >
                <IconButton
                    mt={3}
                    isRound={true}
                    aria-label="Settings"
                    size="lg"
                    icon={<IoIosSettings />}
                    onClick={() => {
                        modalSettings.onOpen();
                    }}
                />
            </Tooltip>

            <Tooltip
                hasArrow
                aria-label="connections"
                label="Connections"
                colorScheme="white"
            >
                <IconButton
                    mt={3}
                    isRound={true}
                    aria-label="Connections"
                    size="lg"
                    icon={<BsPeopleFill />}
                    onClick={() => {
                        router.push("/connections");
                    }}
                />
            </Tooltip>

            <Tooltip
                hasArrow
                aria-label="news"
                label="News"
                colorScheme="white"
            >
                <IconButton
                    mt={3}
                    isRound={true}
                    aria-label="news"
                    size="lg"
                    icon={<BsFillBellFill />}
                    onClick={() => {}}
                />
            </Tooltip>

            <Tooltip
                hasArrow
                aria-label="chats"
                label="Chats"
                colorScheme="white"
            >
                <IconButton
                    mt={3}
                    isRound={true}
                    aria-label="chats"
                    size="lg"
                    icon={<BsFillChatDotsFill />}
                    onClick={() => {}}
                />
            </Tooltip>

            <ModalSettings
                isOpen={modalSettings.isOpen}
                onClose={modalSettings.onClose}
            />
        </Flex>
    );
};
export default LeftPanel;
