import { h } from 'preact';
import ReportsButton from './Reports';
import { LinkButton } from "../../../../components/commons/misc";
import styles from "stylesheets/campaign/creatives/header";
import fontIcons from "stylesheets/icons/fonticons";
import appIcons from "stylesheets/icons/app";
import UploadDialog from '../../../assets/UploadDialog';

export default ({ campaignName, onToggleFilters, onToggleGrid, gridImage, modalStatus }) => (
  <div className={styles.container}>
    <span className={styles.name}>{campaignName}</span>
    <span className={styles.actions}>
      <div className={styles.reportsButton}>
        <ReportsButton/>
      </div>
      <LinkButton icon={fontIcons.fonticonFilter} theme={{ button: styles.filtersButton }} onClick={onToggleFilters}>
        Filters
      </LinkButton>
      <LinkButton icon={`${appIcons.iconGridTheme} ${styles.gridButton}`} theme={{ button: `${styles.filtersButton} ${gridImage? styles.active:''}` }} onClick={onToggleGrid}>
        Grid
      </LinkButton>
      <UploadDialog uploadModalStatus={modalStatus} showTasksModal={modalStatus} />
    </span>
  </div>
);