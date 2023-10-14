import { FC, Fragment } from 'react';
import Layout from '../Layout';
import { Container } from '../Container';
import { SectionTitle } from '../SectionTitle';
import { TaxonomyType, WithLatestPosts } from '../types';
import { Post } from '../../utils/posts';
import { Paginator, PaginatorProps } from '../Paginator';
import { PostHint } from '../post/PostHint';

export interface TaxonomyPageProps extends PaginatorProps {
  taxonomy: string;
  posts: Post[];
  type: TaxonomyType;
}

export const TaxonomyPage: FC<TaxonomyPageProps & WithLatestPosts> = (
  { taxonomy, type, posts, latestPosts, isFirstPage, isLastPage, currentPage },
) => {
  let currentYear: string | null = null;

  return (
    <Layout url={`/${type}/${taxonomy}`} latestPosts={latestPosts}>
      <Container>
        <SectionTitle>
          <span className="taxonomies-title">{type}</span> Archive &mdash; &quot;{taxonomy}&quot;
        </SectionTitle>

        <div>
          {posts.map((post) => {
            const [,, year] = post.formattedDate.split(' ');
            const shouldShowYear = currentYear !== year;

            currentYear = year;

            return (
              <Fragment key={post.slug}>
                {shouldShowYear && <h3 className="article-date-group">&mdash; {year} &mdash;</h3>}
                <PostHint post={post} />
              </Fragment>
            );
          })}
        </div>

        <div>
          <hr />
          <Paginator
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
            currentPage={currentPage}
            basePath={`/${type}/${taxonomy}`}
          />
        </div>
      </Container>
    </Layout>
  );
}
