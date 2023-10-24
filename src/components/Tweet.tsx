import type { FC } from 'react';
import { Tweet as TweetEmbed } from 'react-tweet'

export const Tweet: FC<{ tweetId: string }> = ({ tweetId }) => (
  <div className="flex justify-center">
    <TweetEmbed id={tweetId} />
  </div>
);
