import { h, Component } from 'preact';
import styles from 'stylesheets/assets/panel';
import { LinkButton } from '../../../../components/commons/misc';
import appIcons from 'stylesheets/icons/app';
import AspectRatio from './aspectratio';
import Types from './assettypes';
import Gender from './gender';
import Model from './mop';
import Transparency from './transparency';
import CampaignFolder from './campaignfolder';
import Private from './private';
import Source from './source';
import ColorPicker from './colorpicker';
import Banner from './banner';

const privateSourceFilter = ['cloudinary'];

const FilterComponentMap = {
  'type': {
    component: Types,
    props: () => ({}),
    isInline: false,
    showLabel: false
  },
  'or': {
    component: AspectRatio,
    props: () => ({}),
    isInline: false
  },
  'gender': {
    component: Gender,
    props: () => ({}),
    isInline: false,
    showLabel: false
  },
  'auto_gen': {
    component: CampaignFolder,
    props: () => ({}),
    isInline: true
  },
  'mop': {
    component: Model,
    props: () => ({}),
    isInline: false,
    showLabel: false
  },
  'tr': {
    component: Transparency,
    props: () => ({}),
    isInline: true
  },
  'co': {
    component: ColorPicker,
    props: ({ color, onColorChange }) => ({
      color,
      onColorChange
    }),
    isInline: false
  },
  'so': {
    component: Source,
    props: ({ sourceSearch }) => ({
      sourceSearch
    }),
    isInline: false
  },
  private: {
    component: Private,
    props: () => ({}),
    isInline: true,
  },
  is_banner: {
    component: Banner,
    props: () => ({}),
    isInline: true,
  }
};


export const CustomTypeFilter = ({ type, isActive, onClick, label }) => (
  <div onClick={onClick} className={`${styles.customTypeFilter} ${styles.types} ${isActive ? styles.isActive : ''}`}>
    <div className={`${appIcons[`icon${label}`]} ${styles.iconType}`}/>
    <span>{label}</span>
  </div>
);

const filterLabels = {};

const Filter = ({ onFilterChange, color, onColorChange, filter, onClick, sourceSearch, selectedValues }) => {
  let selected = selectedValues[filter.id] || [];
  selected = typeof selected === 'string' ? [selected] : selected;
  const label = filterLabels[filter.id] ? filterLabels[filter.id](filter) : filter.label;
  
  const { props: propsFunc, component: FilterComponent, isInline, showLabel = true } = FilterComponentMap[filter.id];

  const commonProps = {
    onFilterChange,
    filter,
    selected
  };

  return (
    <div className={styles.filters}>
      {showLabel ?
        <div className={styles.headFilter}>
          <span>{label}</span>
          {isInline && <FilterComponent {...commonProps} {...propsFunc({ sourceSearch, onColorChange, color })} />}
        </div> : ''}
      {!isInline && <FilterComponent {...commonProps} {...propsFunc({ sourceSearch, onColorChange, color })} />}
    </div>
  );
};

export default class FilterPanel extends Component {

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

  openFilter = opened => {
    if (opened === this.state.opened) {
      this.setState({
        opened: ''
      })
    } else {
      this.setState({
        opened
      })
    }
  };

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

  clearFilters = () => {
    const { onFilterCleared, onFilterSelected, allowExactPath, selectFirstFilter } = this.props;
    onFilterCleared();
    onFilterSelected({
      label: 'Public Assets Only',
      id: 'private',
      input: 'single',
      value: 'private',
      editable: true,
      data: { value: "true", label: 'Me' }
    });
    allowExactPath();
    selectFirstFilter();
  };

  render() {
    const { filters = {}, theme = {}, isPickerOpen } = this.props;
    const { color = '#333333' } = this.state;

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
    
    return (
      <div className={`${styles.panel} ${theme.panel}`} ref={node => this.form = node}>
        <h3 className={`${styles.head} ${theme.panelHead}`}>Show Only{filters.selected.length > 0 ?
          <LinkButton onClick={this.clearFilters} style={isPickerOpen?{}:{ marginRight: '3rem' }} theme={styles}>Reset</LinkButton> : ''}
        </h3>
        <div className={styles.filterContainer}>
          {source.map(filter => {
            return (<Filter color={color} onColorChange={this.onColorChange} opened={true}
                            onClick={this.openFilter} onFilterChange={this.onFilterChange}
                            selectedValues={selectedValues} filter={filter}/>)
          })}                   
        </div>
      </div>
    );
  }
};