import type { FC, PropsWithChildren } from 'react';
import { CommentCount } from 'disqus-react';
import type { WithPostProps } from '../types';
import { disqusPropsForPost } from '../../utils/disqus';
import Link from '../Link';

export const PostHeading: FC<PropsWithChildren<WithPostProps>> = ({ post, children }) => (
  <p className="text-right">
    <small>
      <i>
        {post.formattedDate}
        &nbsp;&mdash;&nbsp;
        <Link href={`${post.url}#disqus_thread`}>
          {children}
        </Link>
      </i>
    </small>
  </p>
)
