import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { WithPostProps } from '../types';
import Link from '../Link';

export const PostSocialSharing: FC<WithPostProps> = ({ post }) => {
  const siteUrl = process.env.SITE_URL;
  const encodedUrl = encodeURI(`${siteUrl}${post.url}`);

  return (
    <>
      <p className="text-muted text-center"><small>If you liked this article, feel free to share it:</small></p>
      <div className="buttons">
        <Link
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${post.title}&source=${siteUrl}`}
          className="btn btn-sm btn-social btn-linkedin"
        >
          <FontAwesomeIcon icon={faLinkedinIn} /> LinkedIn
        </Link>
        &nbsp;
        <Link
          href={`https://twitter.com/share?url=${encodedUrl}&text=${encodeURI(post.title)}&via=acelayaa`}
          className="btn btn-sm btn-social btn-twitter"
        >
          <FontAwesomeIcon icon={faTwitter} /> Twitter
        </Link>
        &nbsp;
        <Link
          href={`https://www.facebook.com/sharer.php?u=${encodedUrl}`}
          className="btn btn-sm btn-social btn-facebook"
        >
          <FontAwesomeIcon icon={faFacebookF} /> Facebook
        </Link>
      </div>
    </>
  )
}
