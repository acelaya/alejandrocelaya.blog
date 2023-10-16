import type { FC } from 'react';
import TweetEmbed from 'react-tweet-embed';

export const Tweet: FC<{ tweetId: string }> = ({ tweetId }) => <TweetEmbed tweetId={tweetId} />;
