import React from "react";
import type { NextPage } from "next";
import { Invitations } from "utils/hooks/useUser";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { defaultImage } from "utils/consts";

interface InvitationsProps {
    invitations: Invitations;
}

const Invitations: NextPage<InvitationsProps> = ({ invitations }) => {
    return (
        <Flex flexDir="column">
            <Flex justifyContent="center" p={2} m={2}>
                <Text fontWeight="semibol" fontSize="2xl">
                    Pending Invitations
                </Text>
            </Flex>
            {invitations?.map((invitation) => (
                <Flex
                    justifyContent="space-between"
                    boxShadow="md"
                    p={3}
                    m={3}
                    alignItems="center"
                >
                    <Flex alignItems="center">
                        <Image
                            mr={2}
                            borderRadius="full"
                            boxSize="50px"
                            src={
                                invitation?.requestor?.picture
                                    ? invitation.requestor.picture
                                    : defaultImage
                            }
                        />
                        <Text fontWeight="semibold">
                            {invitation?.requestor?.name}
                        </Text>
                    </Flex>
                    <Flex p={2}>
                        <Button colorScheme="teal" m={1}>
                            Accepet
                        </Button>
                        <Button variant="ghost" colorScheme="pink" m={1}>
                            Decline
                        </Button>
                    </Flex>
                </Flex>
            ))}
            <Flex justifyContent="center" p={2} mt={5}>
                <Text fontWeight="semibol" fontSize="2xl">
                    Connections
                </Text>
            </Flex>
        </Flex>
    );
};

export default Invitations;
