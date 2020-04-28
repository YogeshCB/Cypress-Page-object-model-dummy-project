import { h } from 'preact';
import styles from 'stylesheets/components/shotselector';
import { Tag } from "./index";

export default ({ bindings = [], onSelected, selected }) => (
  <div className={styles.shotSelector}>
    {bindings.map((binding, index) => <Tag hideRemove={true} highlight={index === selected}
                                           onClick={onSelected.bind(null, index)}>Shot {index + 1}</Tag>)}
  </div>
);