import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./../utils/theme/theme";
import { ColorModeScript } from "@chakra-ui/react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    split,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { Provider } from "react-redux";
import { store } from "Redux/store";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createUploadLink({
    uri: "http://localhost:4001/graphql",
    credentials: "include",
});
const wsLink = process.browser
    ? new WebSocketLink({
          uri: "ws://localhost:4001/graphql",
          options: {
              reconnect: true,
          },
      })
    : null;

const splitLink = process.browser
    ? split(
          ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                  definition.kind === "OperationDefinition" &&
                  definition.operation === "subscription"
              );
          },
          wsLink!,
          httpLink
      )
    : httpLink;

const client = new ApolloClient({
    link: splitLink,
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
