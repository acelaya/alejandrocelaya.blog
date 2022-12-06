import Highlight from 'react-highlight';
import Link from '../components/Link';

export const mdxComponents = {
  pre: (props: any) => <Highlight {...props} />,
  a: (props: any) => <Link {...props} />,
}
