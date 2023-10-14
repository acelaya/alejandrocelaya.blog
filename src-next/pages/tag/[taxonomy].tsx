import { TaxonomyPage } from '../../components/pages/TaxonomyPage';
import { getStaticPropsForTaxonomy, getStaticPathsForTaxonomy } from '../../utils/pages';

export const getStaticProps = getStaticPropsForTaxonomy('tag');

export const getStaticPaths = getStaticPathsForTaxonomy('tags');

export default TaxonomyPage;
