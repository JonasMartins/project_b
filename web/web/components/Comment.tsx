import {
    Button,
    Collapse,
    Flex,
    useDisclosure,
    Text,
    Popover,
    Image,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import { NextPage } from "next";
import { BsChatDots } from "react-icons/bs";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { getPostsCommentsType } from "utils/types/post/post.types";
import NexLink from "next/link";

interface CommentProps {
    comments: getPostsCommentsType;
}

const Comment: NextPage<CommentProps> = ({ comments }) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Flex mt={2}>
            <Flex flexDir="column" width="100%">
                <Button
                    aria-label="comments"
                    leftIcon={<BsChatDots />}
                    onClick={onToggle}
                    mb={3}
                >
                    {comments?.comments?.length ?? 0}
                </Button>
                <Collapse in={isOpen} animateOpacity>
                    {comments?.comments?.map((x) => (
                        <Flex
                            p={3}
                            mt={1}
                            boxShadow="md"
                            borderRadius="1rem"
                            flexDir="column"
                        >
                            <Text>{x.body}</Text>
                            <Flex>
                                <Popover placement="top-end" trigger="hover">
                                    <Flex
                                        justifyContent="space-between"
                                        width="100%"
                                    >
                                        <Text
                                            fontWeight="thin"
                                            fontSize="sm"
                                            textAlign="end"
                                        >
                                            Posted At:{" "}
                                            {formatRelative(
                                                new Date(x.createdAt),
                                                new Date()
                                            )}
                                        </Text>
                                        <PopoverTrigger>
                                            <Image
                                                mr={2}
                                                borderRadius="full"
                                                boxSize="32px"
                                                src={getServerPathImage(
                                                    x.author.picture
                                                )}
                                            />
                                        </PopoverTrigger>
                                    </Flex>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverBody>
                                            <NexLink
                                                href={`/user/${x.author.id}`}
                                            >
                                                <Flex
                                                    justifyContent="flex-start"
                                                    p={2}
                                                    alignItems="center"
                                                >
                                                    <Flex alignItems="center">
                                                        <Image
                                                            cursor="pointer"
                                                            mr={2}
                                                            borderRadius="full"
                                                            boxSize="32px"
                                                            src={getServerPathImage(
                                                                x.author.picture
                                                            )}
                                                        />
                                                        {x.author.name}
                                                    </Flex>
                                                </Flex>
                                            </NexLink>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Flex>
                        </Flex>
                    ))}
                </Collapse>
            </Flex>
        </Flex>
    );
};

export default Comment;
