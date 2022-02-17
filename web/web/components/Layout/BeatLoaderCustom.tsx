import { Flex } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

const BeatLoaderCustom = () => {
    return (
        <Flex justifyContent="center" alignItems="center" minHeight="100vh">
            <BeatLoader color="#E10DFF" />
        </Flex>
    );
};

export default BeatLoaderCustom;
