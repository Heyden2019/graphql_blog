import Wrapper from './../components/Wrapper'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss'
import client from './../utils/apolloClient'
import { ApolloProvider } from '@apollo/client';  


function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    </ApolloProvider>
  )
}

export default MyApp