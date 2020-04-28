import { h } from 'preact';
import VideoCard from '../../../components/commons/VideoCard';
import styles from 'stylesheets/campaign/storyboards/index';
import baseStyles from '@bit/kubric.components.styles.commons';
import { arrayToMap } from "@bit/kubric.utils.common.lodash";
import storyboardConstants from "../../../../../isomorphic/constants/creatives";
import Scrollable from '../../../components/commons/hoc/Scrollable';
import fontIcons from 'stylesheets/icons/fonticons';
import EmptyPage from '../../../components/EmptyPage';
import TagFilterTypes from '../../../components/TagFilterTypes';
import { getVideoCardProperties } from "../../utils/video";
import { SelectableGrid } from "../../../components/commons/hoc";
import SSUpload from '../SSUpload';

const getEmptyPageProps = (query) => {
  if (typeof query !== 'undefined' || query.length !== 0) {
    return {
      heading: `No Storyboards for your query`,
      hideIcon: true,
    }
  }
};

const Storyboards = ({ onRowSelected, onRowUnselected, data = {}, }) => {
  let { results: storyboards = [], selected } = data;
  selected = !Array.isArray(selected) ? [selected] : selected;
  if (selected.length > 0 && typeof selected[0] === 'string') {
    selected = arrayToMap(selected);
    selected = storyboards.reduce((acc, storyboard, index) => {
      selected[storyboard.uid] && acc.push(index);
      return acc;
    }, []);
  }
  return (
    <div className={styles.storyboardsContainer}>
      <SelectableGrid selected={selected} onSelected={onRowSelected} onUnselected={onRowUnselected} theme={styles}
                      selectedElement={(
                        <div className={styles.selectedOverlay}>
                          <div className={styles.tick}/>
                        </div>
                      )} multiple={true}>
        {storyboards.map(storyboard => {
            const { name, video: defaultVideo = {} } = storyboard;
            const id = storyboard[storyboardConstants.ID_FIELD];
            return (
              <VideoCard data={storyboard} id={id} card={false} hoverPlay={true} hideControls={true} theme={{
                ...styles,
                container: `${styles.container} ${styles.video}`
              }} {...getVideoCardProperties(defaultVideo)}>
                <div className={styles.name}>{name}</div>
              </VideoCard>
            )
          }
        )}
      </SelectableGrid>
    </div>
  );
};

export default props => {
  const { onFilterChange, onFilterDeleted, onFilterSelected, filters, data = {}, loading, query } = props;
  const { results: storyboards = [] } = data;
  return (
    <div className={baseStyles.clearfix}>
      <TagFilterTypes icon={fontIcons.fonticonSearch} label='Search storyboards' selected={filters.selected}
                      showSelected={true} source={filters.source} value={filters.selected} isLoading={false}
                      onSelected={onFilterSelected} onChange={onFilterChange} onDeleted={onFilterDeleted}
                      freeEntry={true} theme={styles}/>
      {!loading && storyboards.length === 0 && query.length > 0 ? (
        <div className={styles.emptyPage}>
          <EmptyPage {...getEmptyPageProps(query)} />
        </div>
      ) : (
        <Scrollable {...props} theme={{ scroller: styles.scroller }}>
          <Storyboards  {...props} theme={styles}/>
        </Scrollable>
      )}
      <SSUpload/>
    </div>
  );
}
