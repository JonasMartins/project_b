import {
    Box,
    Flex,
    Text,
    useColorMode,
    Image,
    Button,
    Tooltip,
    useDisclosure,
    Collapse,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverArrow,
    PopoverTrigger,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import PostEmotionsRecord from "components/PostEmotionsRecord";
import { getPostsType, getPostsByUserType } from "utils/types/post/post.types";
import { useUser } from "utils/hooks/useUser";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "Redux/Global/GlobalReducer";
import { emotion as emotionElement } from "utils/types/post/post.types";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { BsChatDots } from "react-icons/bs";
import NexLink from "next/link";
import { formatRelative } from "date-fns";

interface CentralFeedPostProps {
    post: getPostsType;
}

const CentralFeedPost: NextPage<CentralFeedPostProps> = ({ post }) => {
    const user = useUser();
    const { colorMode } = useColorMode();
    const { isOpen, onToggle } = useDisclosure();

    const createdEmotion = useSelector(
        (state: RootState) => state.globalReducer.createdEmotion
    );

    const hasCreatedEmotion = useSelector(
        (state: RootState) => state.globalReducer.hasCreatedEmotion
    );

    useEffect(() => {
        if (createdEmotion) {
            if (createdEmotion.post.id === post.id) {
                let emotionObj: emotionElement = {
                    id: createdEmotion.id,
                    type: createdEmotion.type,
                    creator: {
                        id: createdEmotion.creator.name,
                        name: createdEmotion.creator.name,
                    },
                };
                if (!post.emotions) {
                    let emotionsArray: emotionElement[] = [];
                    post.emotions = emotionsArray;
                    post.emotions.push(emotionObj);
                } else {
                    post.emotions.push(emotionObj);
                }
            }
        }
    }, [hasCreatedEmotion]);

    useEffect(() => {}, [post.creator.picture, user]);

    return (
        <Flex
            boxShadow="md"
            p={3}
            bgColor={colorMode === "dark" ? "grey.800" : "white"}
            borderRadius=".5em"
            mt={3}
            flexDir="column"
        >
            <Text>{post.body}</Text>
            <Flex mt={2}>
                {post.files?.length ? (
                    post.files.map((file) => (
                        <Box p={1} m={0} key={file}>
                            <Image
                                src={getServerPathImage(file)}
                                boxSize="52px"
                            />
                        </Box>
                    ))
                ) : (
                    <></>
                )}
            </Flex>
            {user && <PostEmotionsRecord post={post} user={user} />}
            <Flex mt={2}>
                <Flex flexDir="column" width="100%">
                    <Button
                        aria-label="comments"
                        leftIcon={<BsChatDots />}
                        onClick={onToggle}
                        mb={3}
                    >
                        {post.comments?.length ?? 0}
                    </Button>
                    <Collapse in={isOpen} animateOpacity>
                        {post.comments?.map((x) => {
                            return (
                                <Flex
                                    p={3}
                                    mt={1}
                                    boxShadow="md"
                                    borderRadius="1rem"
                                    flexDir="column"
                                >
                                    <Text>{x.body}</Text>
                                    <Flex justifyContent="flex-end">
                                        <Popover
                                            placement="top-end"
                                            trigger="hover"
                                        >
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
                                                                        x.author
                                                                            .picture
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
                            );
                        })}
                    </Collapse>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CentralFeedPost;
