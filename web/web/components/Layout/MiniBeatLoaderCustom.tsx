import { Flex } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

const MiniBeatLoaderCustom = () => {
    return (
        <Flex justifyContent="center" alignItems="center">
            <BeatLoader color="#E10DFF" />
        </Flex>
    );
};

export default MiniBeatLoaderCustom;
