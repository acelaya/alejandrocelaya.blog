import type { FC } from 'react';
import { differenceInYears, parse, formatDistanceToNow } from 'date-fns';
import type { WithPostProps } from '../types';

export const OldPostBanner: FC<WithPostProps> = ({ post }) => {
  const { date } = post;
  const now = new Date();
  const postDate = parse(date, 'y-M-d', now);

  if (differenceInYears(now, postDate) < 3) {
    return null;
  }

  return (
    <div className="mb-6 mt-6 p-2 rounded border border-yellow-300 bg-yellow-100 text-yellow-900 text-center">
      <b>Warning!</b> This post was published <b>{formatDistanceToNow(postDate)}</b> ago, so it can contain outdated
      information. Bear this in mind when putting it into practice or leaving new comments.
    </div>
  );
};
