import React from "react";
import type { NextPage } from "next";
import { Flex } from "@chakra-ui/react";
interface LeftPanelProps {}

const LeftPanel: NextPage<LeftPanelProps> = ({}) => {
    return <Flex flexGrow={1} flexDir="column" m={5}></Flex>;
};
export default LeftPanel;
