import { h, Component } from 'preact';
import styles from 'stylesheets/assets/filtercompact';
import SelectBox from '../../../components/commons/SelectBox';
import { capitalize } from '../../../lib/utils';
import appIcons from 'stylesheets/icons/app';
import ColorPicker from './panel/colorpicker';
import { SecondaryButton } from '../../../components/commons/misc';


const privateSourceFilter = ['cloudinary'];

class Filter extends Component {
    constructor(props) {
        super(props);
        let color = '#333333';
        props.filters.selected && props.filters.selected.map(filter => {
          if (filter.id === 'co') {
            color = filter.data.value;
          }
        });
        this.state = {
          opened: '',
          color
        }
      }

  onColorChange = color => {
    this.setState({
      color
    })
  };
    onFilterChange = value => {
        const { onFilterSelected, onFilterDeleted, filters: { selected = [] } } = this.props;
        let exists = false;   
        if (selected.length > 0) {
          selected.map(fltr => {
            if (typeof value.data === 'object' && fltr.data.value === value.data.value && fltr.id === value.id) {
              onFilterDeleted && onFilterDeleted(value);
              exists = true;
            }
            // if filter exists but only single value is supported, delete old value and apply new
            else if (typeof value.data === 'object' && (fltr.id === value.id && (value.input === 'single' || value.input === 'text'))) {
              onFilterDeleted && onFilterDeleted(fltr);
              onFilterSelected && onFilterSelected(value);
              exists = true;
            }
          });
          if (!exists) {
            onFilterSelected && onFilterSelected(value);
          }
        } else {
          onFilterSelected && onFilterSelected(value);
        }
      };

    render() {
        const { filters } = this.props;
        const { color } = this.state;

        const colorFilter = filters.source.filter(flt=>flt.id === 'co')[0];
        let selectedValues = {};
        filters.selected.map(flt => {
        if (selectedValues[flt.id] && flt.input === 'multiple') {
            selectedValues = {
            ...selectedValues,
            [flt.id]: [...selectedValues[flt.id], flt.data.value]
            }
        } else {
            selectedValues = {
            ...selectedValues,
            [flt.id]: [flt.data.value]
            }
        }
        });
        // hide source filter if user is viewing private filters
        const showSourceFilter = selectedValues.private && selectedValues.private.indexOf('false') > -1;
        let source = filters.source;    
        if (!showSourceFilter) {
        source = source.map(flt => {
            if(flt.id === 'so'){
            flt = {
                ...flt,
                data: flt.data.filter(flt=> privateSourceFilter.indexOf(flt.value)>-1)
            }
            }
            return flt
        });
        }
        const boxes = source.filter(flt=> flt.id==='or'||flt.id==='tr'||flt.id==='so').map(filter=>{
            return [<SelectBox label={filter.label} options={filter.data}  theme={styles} onChange={(value)=>{ 
                this.onFilterChange({
                        ...filter, 
                        data: {
                            value,
                            label: capitalize(value)
                        }})
                }}></SelectBox>,     
                <div className={styles.divider}></div>]       
        })
        console.log(selectedValues['is_banner']);
        return (
            <div className={styles.filters}>
                {boxes}
                <SelectBox theme={styles} label={'Colors'}>
                    <ColorPicker 
                    selected={selectedValues['co']}
                    onFilterChange={this.onFilterChange}
                    filter={colorFilter} color={color} onColorChange={this.onColorChange} />
                </SelectBox>
                {filters.source.filter(flt=>flt.id === 'is_banner').length>0?
                <SecondaryButton onClick={(e)=>this.onFilterChange({
                  ...filters.source.filter(flt=>flt.id === 'is_banner')[0],
                  data: {
                    value: selectedValues['is_banner'] && selectedValues['is_banner'].indexOf('false')>-1 && filter.id === 'is_banner' ? 'true' : 'false',
                    label: 'Exclude Banners'
                  }
                })} className={selectedValues['is_banner'] && selectedValues['is_banner'].indexOf('false')>-1?styles.active:styles.bannerFilter}>
                  <span className={appIcons.iconHide}></span>&nbsp;
                  Banners
                </SecondaryButton>:''}
            </div>
        );
    }
}

export default Filter;