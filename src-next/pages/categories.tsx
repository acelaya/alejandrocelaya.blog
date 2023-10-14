import { TaxonomiesPage } from '../components/pages/TaxonomiesPage';
import { getStaticPropsForTaxonomies } from '../utils/pages';

export const getStaticProps = getStaticPropsForTaxonomies('categories');

export default TaxonomiesPage;
