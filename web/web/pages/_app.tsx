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
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

const uriServer = "http://localhost:4001/graphql";

/*
npm install apollo-client apollo-boost apollo-link-http apollo-cache-inmemory react-apollo apollo-link-context @reach/router js-cookie graphql-tag
*/

const httpLink = createHttpLink({ uri: uriServer });
const authLink = setContext((_, { headers }) => {
    //const token = Cookies.get("token");
    const token = "test";
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
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
