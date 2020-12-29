import { FC } from 'react';
import Link from '../Link';

export const LeftMenuItems: FC = () => (
  <>
    <li><Link href="/">Home</Link></li>
    <li><Link href="/category/php/">PHP</Link></li>
    <li><Link href="/category/zf/">ZF</Link></li>
    <li><Link href="/category/web/">Web</Link></li>
    <li><Link href="/category/tools/">Tools</Link></li>
    <li><Link href="/category/oss/">OSS</Link></li>
  </>
);
