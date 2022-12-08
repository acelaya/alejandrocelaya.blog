import Router from 'next/router';
import withGA from 'next-ga';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-image-lightbox/style.css';
import 'prismjs/themes/prism-okaidia.min.css';
import '../styles/theme.css';
import '../styles/social-buttons.css';
import '../styles/global.css';

function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default withGA(process.env.GA, Router)(App);
