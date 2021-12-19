import React from "react";
import type { NextPage } from "next";
import { Spinner, Flex } from "@chakra-ui/react";
interface FlexSpinnerProps {}

const FlexSpinner: NextPage<FlexSpinnerProps> = ({}) => {
    return (
        <Flex flexGrow={1} justifyContent="center" alignItems="center" m={5}>
            <Spinner size="xl" />
        </Flex>
    );
};
export default FlexSpinner;
