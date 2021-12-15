import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./../utils/theme/theme";
import { ColorModeScript } from "@chakra-ui/react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
} from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:4001/graphql",
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
