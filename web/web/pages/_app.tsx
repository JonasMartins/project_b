import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./../utils/theme/theme";
import { ColorModeScript } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { Provider } from "react-redux";
import { store } from "Redux/store";

const httpLink = createUploadLink({
    uri: "http://localhost:4001/graphql",
    credentials: "include",
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    name: "TechBlog",
    version: "0.0.1_alpha",
});
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <ChakraProvider theme={theme}>
                    <ColorModeScript
                        initialColorMode={theme.config.initialColorMode}
                    />
                    <Component {...pageProps} />
                </ChakraProvider>
            </Provider>
        </ApolloProvider>
    );
}

export default MyApp;
