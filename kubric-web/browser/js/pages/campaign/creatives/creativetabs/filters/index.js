import { h } from 'preact';
import FiltersPanel from '../../../../../components/commons/FilterPanel';

export default ({ showFilters, selected = [], source = [], onToggleFilters, onClearSelectedFilters, onFilterSelected }) => {
  source = source.filter(({ visibility = true }) => visibility);
  return (
    <FiltersPanel show={showFilters} filters={source} selected={selected} onHide={onToggleFilters}
                  onReset={onClearSelectedFilters} onChange={onFilterSelected}/>
  );
}