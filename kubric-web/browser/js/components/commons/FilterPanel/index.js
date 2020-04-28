import { h } from 'preact';
import { at, isUndefined, isFunction } from '@bit/kubric.utils.common.lodash';
import Drawer from '../Drawer';
import { LinkButton } from "../misc";
import { SingleSelect, MultipleSelect } from "./checkbox";
import Text from './input';
import styles from 'stylesheets/components/commons/filterpanel';
import Radio from './radio';

const fieldMap = {
  checkbox: {
    multiple: MultipleSelect,
    single: SingleSelect
  },
  text: {
    single: Text
  },
  radio: {
    single: Radio
  }
};

const getSelected = (config, selected, input) => {
  const currentFilters = selected.filter(({ id }) => id === config.id);
  if (input === 'multiple') {
    return currentFilters;
  } else if (currentFilters.length > 0 && currentFilters[0].id === config.id) {
    return currentFilters[0].value || currentFilters[0];
  }
};

export default ({ filters = [], show, onChange, onHide, onReset, selected = [], fieldMap: customFieldMap = {} }) => {
  const fields = {
    ...fieldMap,
    ...customFieldMap
  };
  return (
    <Drawer show={show} onHide={onHide} showClose={false} theme={styles}>
      <div className={styles.container}>
        <div className={styles.header}>
          <LinkButton onClick={onReset} className={styles.reset}>Reset</LinkButton>
        </div>
        <div className={styles.filters}>
          {
            filters.map(({ field, input = "single", ...config }) => {
              let [Field] = at(fields, `${field}.${input}`);
              if (isUndefined(Field) && isFunction(field)) {
                Field = field;
              }
              return !isUndefined(Field) ? (
                <div className={styles.filter}>
                  <Field config={config} value={getSelected(config, selected, input)} onChange={onChange}/>
                </div>
              ) : <span/>;
            })
          }
        </div>
      </div>
    </Drawer>
  );
}