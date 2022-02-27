import type { NextPage } from "next";
import Container from "components/Container";
import { Flex, Box, Grid, GridItem, useColorMode } from "@chakra-ui/react";
import Footer from "components/Layout/Footer";
import LeftPanel from "components/Layout/LeftPanel";
import NavBar from "components/Layout/NavBar";
import RightPanel from "components/Layout/RightPanel";

interface notificationsProps {}

const Notifications: NextPage = () => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.700" };

    return (
        <Container>
            <Flex
                flexDir="column"
                flexGrow={1}
                justifyContent="space-between"
                height="100vh"
            >
                <Box>
                    <NavBar />
                    <Grid
                        mt={10}
                        templateRows="repeat(1, 1fr)"
                        templateColumns="repeat(7, 1fr)"
                        gap={4}
                        borderRadius="1rem"
                    >
                        <GridItem />
                        <GridItem
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                            borderRadius="1rem"
                        >
                            <LeftPanel />{" "}
                        </GridItem>
                        <GridItem
                            colSpan={3}
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                            borderRadius="1rem"
                        ></GridItem>
                        <GridItem
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                            borderRadius="1rem"
                        >
                            <RightPanel />
                        </GridItem>
                        <GridItem />
                    </Grid>
                </Box>
                <Box>
                    <Footer />
                </Box>
            </Flex>
        </Container>
    );
};

export default Notifications;
