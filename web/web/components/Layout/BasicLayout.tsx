import React from "react";
import type { NextPage } from "next";
import NavBar from "components/Layout/NavBar";
import Container from "components/Container";
interface BasicLayoutProps {}

const BasicLayout: NextPage<BasicLayoutProps> = ({ children }) => {
    return (
        <Container>
            <NavBar />
            {children}
        </Container>
    );
};
export default BasicLayout;
