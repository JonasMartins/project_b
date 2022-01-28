import React from "react";
import type { NextPage } from "next";
import { SkeletonText, Box } from "@chakra-ui/react";
interface SkeletonLinesProps {}

const SkeletonLinesr: NextPage<SkeletonLinesProps> = ({}) => {
    return (
        <Box padding="6" boxShadow="lg" bg="white">
            <SkeletonText mt={3} noOfLines={7} spacing={3} />
        </Box>
    );
};
export default SkeletonLinesr;
