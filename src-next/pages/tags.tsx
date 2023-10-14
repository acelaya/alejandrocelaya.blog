import { TaxonomiesPage } from '../components/pages/TaxonomiesPage';
import { getStaticPropsForTaxonomies } from '../utils/pages';

export const getStaticProps = getStaticPropsForTaxonomies('tags');

export default TaxonomiesPage;
