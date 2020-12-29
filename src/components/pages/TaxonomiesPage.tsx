import { FC } from 'react';
import Layout from '../Layout';
import { Container } from '../Container';
import { SectionTitle } from '../SectionTitle';
import Link from '../Link';
import { TaxonomiesType } from '../types';

export interface TaxonomiesPageProps {
  taxonomies: string[];
  type: TaxonomiesType;
}

const buildTaxonomyUrl = (taxonomy: string, type: TaxonomiesType) =>
  `/${type === 'categories' ? 'category' : 'tag'}/${encodeURI(taxonomy)}`;

export const TaxonomiesPage: FC<TaxonomiesPageProps> = ({ taxonomies, type }) => {
  return (
    <Layout url={`/${type}`}>
      <Container>
        <SectionTitle className="taxonomies-title">{type}</SectionTitle>

        <div className="taxonomies-list">
          {taxonomies.map((taxonomy) => (
            <>
              <Link key={taxonomy} href={buildTaxonomyUrl(taxonomy, type)} className="btn btn-default">
                {taxonomy.replace(/-/g, ' ')}
              </Link>
              {' '}
            </>
          ))}
        </div>
      </Container>
    </Layout>
  );
}
