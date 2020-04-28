import { h } from 'preact';
import styles from 'stylesheets/components/commons/embeddedselector';
import { Link } from "@bit/kubric.utils.common.router";
import { isFunction, isUndefined, isString } from "@bit/kubric.utils.common.lodash";

const getIcon = ({ icon } = {}) => isString(icon) ? <span className={icon}/> : (!isUndefined(icon) ? icon : null);

const Options = ({ options, onSelected, theme, selected, parent = [], loader }) => (
  <div>
    {options.map((option, index) => {
      const { link, label, options: subOptions = [], loading, helperText } = option;
      const onClick = isFunction(onSelected) ? onSelected.bind(null, [...parent, index]) : undefined;
      const isSelected = index === selected[0];
      const optionClasses = `${styles.option} ${theme.option || ''} ${isSelected ? `${styles.selected} ${theme.selected || ''}` : ''}`;
      const icon = getIcon(option);
      return (
        <div className={parent.length > 0 ? `${theme.subOption || ''} ${styles.subOption}` : ''}>
          <Link onClick={onClick} to={link} className={optionClasses}>
            {icon}
            <span className={styles.optionLabel}>{label}</span>
            {helperText && <span className={`${styles.optionLabel} ${styles.bold}`}>{helperText}</span>}
          </Link>
          {(loading && loader) ? loader : (subOptions.length > 0 ? (
            <Options options={subOptions} onSelected={onSelected} theme={theme} parent={[index]}
                     selected={isSelected && selected.slice(1)}/>
          ) : <span/>)}
        </div>
      );
    })}
  </div>
);

export default ({ options = [], selected = [], onSelected, theme = {}, loader }) => (
  <div className={`${styles.selector} ${theme.selector || ''}`}>
    <Options options={options} onSelected={onSelected} theme={theme} selected={selected} loader={loader}/>
  </div>
);