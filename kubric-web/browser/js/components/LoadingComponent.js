import { h } from 'preact';
import styles from 'stylesheets/components/loading';
import { Spinner } from "./index";

export default ({ theme = {} }) => (
  <div theme={{ "spinner": `${styles.loadingComponent} ${theme.container}` }}>
    <Spinner theme={theme}/>
  </div>
);
