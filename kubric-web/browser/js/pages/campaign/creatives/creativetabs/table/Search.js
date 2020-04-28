import { h } from 'preact';
import FilterInput from "../../../../../components/commons/FilterPanel/input";
import creativesListPack from "../../../../../store/objects/campaign/creatives/list";
import { connect } from "preact-redux";
import creativesOperations from "../../../../../store/objects/campaign/creatives/operations";
import styles from 'stylesheets/campaign/creatives/table/search';

const SearchBox = ({ filters, onChange }) => {
  const { source, selected } = filters;
  const [{ field, ...idFilterConfig }] = source.filter(({ id }) => id === 'search');
  const [{ value = '' } = {}] = selected.filter(({ id }) => id === 'search');
  return <FilterInput placeholder="Search by name or url" config={idFilterConfig} value={value} onChange={onChange}
                      hidelabel={true} theme={styles}/>
};

export default connect(state => {
  const filters = creativesListPack.selectors.getFilters();
  return {
    filters
  };
}, {
  onChange: creativesOperations.onFilterSelected
})(SearchBox);