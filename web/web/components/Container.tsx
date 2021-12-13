import { Flex } from "@chakra-ui/layout";
import type { NextPage } from "next";

interface ContainerProps {}

const Container: NextPage<ContainerProps> = ({ children }) => {
    return <Flex direction="column">{children}</Flex>;
};

export default Container;
