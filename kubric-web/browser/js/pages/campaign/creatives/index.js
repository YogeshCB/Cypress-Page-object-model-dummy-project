import { h } from 'preact';
import Header from './Header';
import Tabs from './CreativeTabs';
import SSUpload from '../SSUpload';
import styles from "stylesheets/campaign/creatives";

export default () => (
  <div className={styles.creatives}>
    <Header/>
    <Tabs/>
    <SSUpload/>
  </div>
);