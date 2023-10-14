import { FC } from 'react';
import { differenceInYears, parse, formatDistanceToNow } from 'date-fns';
import { WithPostProps } from '../types';

export const OldPostBanner: FC<WithPostProps> = ({ post }) => {
  const { date } = post;
  const now = new Date();
  const postDate = parse(date, 'y-M-d', now);

  if (differenceInYears(now, postDate) < 3) {
    return null;
  }

  return (
    <div className="alert alert-warning text-center">
      <b>Warning!</b> This post was published <b>{formatDistanceToNow(postDate)}</b> ago, so it can contain outdated
      information. Bear this in mind when putting it into practice or leaving new comments.
    </div>
  );
};
