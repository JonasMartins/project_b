import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import {
    pallet,
    fonts,
    fontWeights,
    fontSizes,
    lineHeights,
} from "./themeDefs";

const breakpoints = createBreakpoints({
    sm: "40em",
    md: "52em",
    lg: "64em",
    xl: "80em",
    "2xl": "96em",
});

const theme = extendTheme({
    // pallet generator: https://smart-swatch.netlify.app/#48BB78
    // gradient
    colors: pallet,
    fonts,
    fontSizes,
    fontWeights,
    lineHeights,
    breakpoints,

    initialColorMode: "system",
    useSystemColorMode: true,

    components: {
        Button: {
            baseStyle: {
                fontWeight: "semibold", // Normally, it is "semibold"
            },
            variants: {
                "phlox-gradient-light": {
                    bgGradient: "linear(to-r, #6c23b5, #d8006c)",
                },
                "phlox-gradient-dark": {
                    bgGradient: "linear(to-r, #311052, #890045)",
                },
            },
        },
    },
});

export default theme;
