import { FC } from 'react';
import { CommentCount } from 'disqus-react';
import { WithPostProps } from '../types';
import { disqusPropsForPost } from '../../utils/disqus';
import Link from '../Link';

export const PostHeading: FC<WithPostProps> = ({ post }) => (
  <p className="text-right">
    <small>
      <i>
        {post.formattedDate}
        &nbsp;&mdash;&nbsp;
        <Link href={`${post.url}#disqus_thread`}>
          <CommentCount {...disqusPropsForPost(post)}>Comments</CommentCount>
        </Link>
      </i>
    </small>
  </p>
)
