import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Flex,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import SettingsForm from "components/Form/settings.form";
import { useUser } from "utils/hooks/useUser";
import { useEffect } from "react";
import Spinner from "components/Layout/Spinner";

interface ModalSettingsProps {
    onClose: () => void;
    isOpen: boolean;
}

const ModalSettings: NextPage<ModalSettingsProps> = ({ isOpen, onClose }) => {
    const user = useUser();

    useEffect(() => {}, [user]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"lg"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex>
                        <Text>Settings</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {user ? <SettingsForm user={user} /> : <Spinner />}
                </ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalSettings;
