import { h } from 'preact';
import styles from 'stylesheets/assets/panel';


const aspectRatioMap = {
  'Square': 'square',
  'Portrait': 'twoOne',
  'Landscape': 'oneTwo',
};

const CustomCheckBox = ({ size, isActive, onClick, label }) => <div onClick={onClick}
                                                                    className={`${styles.customTypeFilterAspect} ${isActive ? styles.isActiveDiv : ''}`}>
  <div className={`${styles[aspectRatioMap[size]]} ${isActive ? styles.isActive : ''}`}>
  </div>
  <span>{label}</span>
</div>;

export default ({ filter, onFilterChange, selected }) => {
  return <div className={`${styles.content}  ${styles.typeContentAspect}`}>
    {Array.isArray(filter.data) && filter.data.map(flt => {
      return <CustomCheckBox onClick={onFilterChange.bind(null, {
        ...filter,
        data: {
          value: flt.value,
          label: flt.label
        }
      })} size={flt.label} label={flt.label} isActive={selected.indexOf(flt.value) > -1}/>
    })}
  </div>
}