import { Box, Flex, Grid, GridItem, useColorMode } from "@chakra-ui/react";
import Container from "components/Container";
import Footer from "components/Layout/Footer";
import LeftPanel from "components/Layout/LeftPanel";
import NavBar from "components/Layout/NavBar";
import RightPanel from "components/Layout/RightPanel";
import type { NextPage } from "next";
import React from "react";

const Connections: NextPage = () => {
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
                    >
                        <GridItem />
                        <GridItem bg={bgColor[colorMode]} boxShadow="lg">
                            <LeftPanel />{" "}
                        </GridItem>
                        <GridItem
                            colSpan={3}
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                        ></GridItem>
                        <GridItem bg={bgColor[colorMode]} boxShadow="lg">
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

export default Connections;
