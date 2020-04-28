import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/tabs';
import { getPreactChildProps as getChildProp } from '@bit/kubric.utils.common.preact';
import { Spinner } from "../index";
import { isString } from "@bit/kubric.utils.common.lodash";
import { StyleExtractor } from "@bit/kubric.components.styles.utils";

export const Tab = ({ theme = {}, loading = false, children, id }) => {
  const styler = new StyleExtractor(styles, theme);
  return (
    <div className={styler.get('tab')} id={id}>
      {loading ? <Spinner theme={{ spinner: styles.spinner }}/> : children}
    </div>
  );
};

export const Tabs = ({ children, theme = {}, selected, onTabOpened }) => {
  const tabIds = children.map(child => getChildProp(child, 'id'));
  const selectedChild = isString(selected) ? tabIds.indexOf(selected) : children[selected];
  const styler = new StyleExtractor(styles, theme);
  const tabs = tabIds.map((id, index) => {
    const label = getChildProp(children[index], 'label');
    const loading = getChildProp(children[index], 'loading');
    const isSelected = selectedChild === index;
    return (
      <div
        className={`${styler.get('tabHeader')} ${selectedChild === index ? styles.selected : ''}`}
        onClick={() => onTabOpened && setImmediate(onTabOpened, id, index)}>{label} {(loading && !isSelected) ?
        <Spinner theme={{ spinner: styles.headspinner }} noOverlay={true}/> : <span/>}</div>)
  });
  return (
    <div className={styler.get('tabs')}>
      <div className={styler.get('tabHeaders')}>{tabs}</div>
      <div className={styler.get('tabContent')}>{children[selectedChild]}</div>
    </div>
  );
};