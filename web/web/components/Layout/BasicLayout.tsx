import React from "react";
import type { NextPage } from "next";
import NavBar from "components/Layout/NavBar";
import Container from "components/Container";
import { Flex, Grid, GridItem, useColorMode } from "@chakra-ui/react";
import LeftPanel from "components/Layout/LeftPanel";
import RightPanel from "components/Layout/RightPanel";
import CentralFeed from "components/Layout/CentralFeed";
import Footer from "components/Layout/Footer";

interface BasicLayoutProps {}

const BasicLayout: NextPage<BasicLayoutProps> = ({ children }) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.700" };

    return (
        <Container>
            <Flex flexDir="column" flexGrow={1}>
                <NavBar />
                <Grid
                    mt={10}
                    h="300px"
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
                    >
                        <CentralFeed />{" "}
                    </GridItem>
                    <GridItem bg={bgColor[colorMode]} boxShadow="lg">
                        <RightPanel />
                    </GridItem>
                    <GridItem />
                </Grid>
                {children}
            </Flex>
            <Footer />
        </Container>
    );
};
export default BasicLayout;
