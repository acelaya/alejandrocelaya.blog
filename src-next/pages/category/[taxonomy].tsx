import { TaxonomyPage } from '../../components/pages/TaxonomyPage';
import { getStaticPropsForTaxonomy, getStaticPathsForTaxonomy } from '../../utils/pages';

export const getStaticProps = getStaticPropsForTaxonomy('category');

export const getStaticPaths = getStaticPathsForTaxonomy('categories');

export default TaxonomyPage;
