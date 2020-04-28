import { h } from 'preact';
import Form from './Form';
import Table from './Table';
import Filters from './Filters';
import config from "../../../../config";
import styles from "stylesheets/campaign/creatives/tabs";
import { Tabs, Tab } from "../../../../components/commons/Tabs";
import { creativeTabs } from "../../../../../../isomorphic/constants/creatives";
import { PrimaryButton } from "../../../../components/commons/misc";

const tabsConfig = config.creatives.tabs;

const tabOrder = config.creatives.order;

const EmptyCreatives = ({ onOpenUpload }) => (
  <div className={styles.empty}>
    <div className={styles.icon}/>
    <div className={styles.text}>
      <div className={styles.message}>There are no creatives under this campaign. Let's start by uploading your
        creatives.
      </div>
      <PrimaryButton className={styles.button} onClick={onOpenUpload}>Upload Creatives</PrimaryButton>
    </div>
  </div>
);

export default ({ stats = {}, onOpenUpload, tabCounts: counts = {}, loadingTabs = {}, activeTab, onTabChanged, data = {} }) => {
  const { selected = [] } = data;
  const { all: total = 0 } = stats;
  if (total === 0) {
    return <EmptyCreatives onOpenUpload={onOpenUpload}/>
  } else {
    const tabs = tabOrder.reduce((acc, tabId) => {
      if (counts[tabId] > 0) {
        const props = {
          id: tabId,
          label: `${tabsConfig[tabId].label}${tabId !== creativeTabs.FILTERED ? `(${counts[tabId]})` : ''}`,
          loading: loadingTabs[tabId] || false
        };
        if (tabId === activeTab) {
          acc.push(<Tab {...props} theme={{ tab: styles.tab }}><Table/></Tab>);
        } else {
          acc.push(<Tab{...props}/>);
        }
      }
      return acc;
    }, []);
    return (
      <div className={styles.creativetabs}>
        <Tabs selected={activeTab} onTabOpened={onTabChanged}>{tabs}</Tabs>
        {selected.length === 1 ? <Form/> : <span/>}
        <Filters/>
      </div>
    );
  }
}
