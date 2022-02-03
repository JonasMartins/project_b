import { Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import BeatLoader from "react-spinners/BeatLoader";

interface userPageProps {}

const UserPage: NextPage<userPageProps> = () => {
    const router = useRouter();

    const { user } = router.query;

    return <Flex>{user}</Flex>;
};

export default UserPage;
