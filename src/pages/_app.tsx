import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-image-lightbox/style.css';
import 'highlight.js/styles/github.css';
import '../styles/theme.css';
import '../styles/social-buttons.css';
import '../styles/global.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
};
