import { h } from 'preact';
import { Tag } from "../../index";
import styles from 'stylesheets/components/commons/filterpanel';
import { StyleExtractor } from "@bit/kubric.components.styles.utils";
import { getVisibleFilterSet } from "../../../store/objects/campaign/creatives/utils";

export default ({ selected = [], source = [], onRemove, theme = {} }) => {
  const styler = new StyleExtractor(styles, theme);
  const visibleFilterSet = getVisibleFilterSet(source);
  return (
    <div className={styler.get('selectedFilters')}>
      {selected.reduce((acc, filter) => {
        const { id, label, data = {}, value, displayValue } = filter;
        const finalValue = data.label || displayValue || value;
        const suffix = finalValue.length > 0 ? `: ${finalValue}` : '';
        visibleFilterSet.has(id) && acc.push(<Tag theme={theme}
                                                  onRemove={onRemove.bind(null, filter)}>{label}{suffix}</Tag>);
        return acc;
      }, [])}
    </div>
  );
}