import {h, Component } from 'preact';
import styles from '../../../stylesheets/components/commons/filter.scss';
import SelectBox from './SelectBox';
import Field from '../commons/Field';


export default class FilterSelect extends Component {
    queryChange(e){
        const { queryChange } = this.props;
        queryChange(e);
    }
    filterChange(e, label){
        const { filterChange } = this.props;
        filterChange(e, label);
    }
    render() {
        const { filterConfig, filter, filterFunction, filterChange, debounce, value, name } = this.props;
        return (<div className={styles.filterField}>
            <SelectBox 
                options={filterConfig}
                value={filter.id}
                onChange={(e)=>this.filterChange(e, filter.label)}
                theme={styles}
                label={filter.label}
            />
            <div className={styles.searchField}>
                <Field placeholder='Search'
                value={value} debouncedOnChange={filterFunction} debounce={debounce} onChange={(e)=>this.queryChange(e)}/>
            </div>
        </div>
        );
    }
}
