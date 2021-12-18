import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./../utils/theme/theme";
import { ColorModeScript } from "@chakra-ui/react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";

const httpLink = createHttpLink({
    uri: "http://localhost:4001/graphql",
    credentials: "include",
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <ChakraProvider theme={theme}>
                <ColorModeScript
                    initialColorMode={theme.config.initialColorMode}
                />
                <Component {...pageProps} />
            </ChakraProvider>
        </ApolloProvider>
    );
}

export default MyApp;
