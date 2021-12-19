import { Flex, useColorMode } from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "public/images/techBlog_logo_1024x965.png";

interface FooterProps {}

const Footer: NextPage<FooterProps> = ({}) => {
    const { colorMode } = useColorMode();
    const [shades, setShades] = useState(["#7928CA", "#FF0080"]);

    useEffect(() => {
        if (colorMode === "light") {
            setShades(["#6c23b5", "#d8006c"]);
        } else {
            setShades(["#311052", "#890045"]);
        }
    }, [colorMode]);

    return (
        <Flex
            flexGrow={1}
            bgGradient={`linear(to-l, ${shades[0]}, ${shades[1]} )`}
            m={0}
            boxShadow="lg"
            height="20em"
            bottom={0}
            left={0}
            width="100%"
            position="fixed"
            alignItems="center"
            justifyContent="center"
        >
            <Image src={Logo} alt="TechBlog" width={"150px"} height={"150px"} />
        </Flex>
    );
};
export default Footer;
