import React, { useCallback, useEffect } from "react";
import type { NextPage } from "next";
import { Flex, Tooltip, IconButton, useDisclosure } from "@chakra-ui/react";
import { IoIosSettings } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import ModalSettings from "components/Modal/modalSettings";
import { useSelector } from "react-redux";
import { globalState } from "Redux/Global/GlobalReducer";

interface LeftPanelProps {}

const LeftPanel: NextPage<LeftPanelProps> = ({}) => {
    const modalSettings = useDisclosure();

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
                    onClick={() => {}}
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

            <ModalSettings
                isOpen={modalSettings.isOpen}
                onClose={modalSettings.onClose}
            />
        </Flex>
    );
};
export default LeftPanel;
