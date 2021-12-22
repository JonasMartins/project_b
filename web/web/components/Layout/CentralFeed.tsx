import React from "react";
import type { NextPage } from "next";
import { Flex } from "@chakra-ui/react";
import PostFeedForm from "components/Form/postFeed.form";

interface CentralFeedProps {}

const CentralFeed: NextPage<CentralFeedProps> = ({}) => {
    return (
        <Flex flexGrow={1} flexDir="column" m={5}>
            <PostFeedForm />
        </Flex>
    );
};
export default CentralFeed;
