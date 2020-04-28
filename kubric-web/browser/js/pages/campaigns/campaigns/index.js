import { h, Component } from 'preact';
import baseStyles from '@bit/kubric.components.styles.commons';
import styles from 'stylesheets/campaigns/campaigns';
import Grid from '../../../components/commons/Table/index';
import Sharer from '../../../components/Assets/navigator/sharer';
import { capitalize } from '@bit/kubric.utils.common.lodash';
import fontIcons from 'stylesheets/icons/fonticons';
import TagFilterTypes from '../../../components/TagFilterTypes';
import ClickOutside from '../../../mixins/ClickOutside';
import NewCampaignButton from './NewCampaignButton';
import appStyles from 'stylesheets/app';

const campaignHeaders = [{
  displayName: 'Name',
  data: 'name',
  theme: {
    cell: styles.columnName,
  },
}, {
  displayName: 'Type',
  data: 'mediaFormat',
  content: value => (
    <span>{capitalize(value === 'image' ? 'collage' : value)}</span>
  ),
  theme: {
    cell: styles.columnFormat,
  },
}, {
  displayName: 'Created On',
  data: 'desc',
  content: value => <span>{value}</span>,
  theme: {
    cell: styles.columnDate,
  },
}, {
  displayName: 'No. of Videos',
  data: 'ads_count',
}, {
  displayName: 'Sample Video URL',
  data: 'template.defaultVideo.videoURL',
  content: value => <a target="_blank" href={value}>View</a>,
  theme: {
    cell: styles.columnFB,
  },
}];


export default class Campaigns extends Component {
  onSelected(isSelected, { uid }, index) {
    const { onRowSelected, onRowUnselected } = this.props;
    const callFn = isSelected ? onRowSelected : onRowUnselected;
    callFn && setImmediate(callFn, {
      uid,
      index,
    });
  }

  onCampaignSelected(campaign) {
    this.props.onCampaignSelected && this.props.onCampaignSelected(campaign);
  }

  showTeams = () => {
    this.props.onShowTeams();
    this.props.fetchTeams();
  }

  render() {
    const {
      campaigns, limit, filters, onFilterChange, completed, onLoadNext, onFilterDeleted, selectedCampaigns, onFilterSelected,
      onLimitChange, loading, teamsLoading, onSelectTeams, teams, showShared, confirmShare, selectedTeams, onCloseShared
    } = this.props;

    const search = selectedCampaigns.length > 0 ? false :
      <TagFilterTypes theme={styles} icon={fontIcons.fonticonSearch} onChange={onFilterChange}
                      required label='Search' selected={filters.selected} source={filters.source}
                      value={filters.selected}
                      isLoading={false} showSelected={true} onSelected={onFilterSelected} onDeleted={onFilterDeleted}
                      freeEntry={true}/>
    const ShareWithTeams = ClickOutside({
      component: Sharer,
      props: {
        theme: styles,
        selectedTeams,
        confirmShare,
        close: onCloseShared,
        teams,
        onSelectTeams,
        loading: teamsLoading
      }
    });
    return (
      <div className={baseStyles.clearfix}>
        <div className={styles.gridContainer}>
          {showShared ? <ShareWithTeams/> : null}
          {selectedCampaigns.length > 0 ? <span className={styles.share} onClick={this.showTeams}>Share</span> : ''}
          <div className={styles.header}>
            <div className={appStyles.pageheading}>My Campaigns</div>
            <NewCampaignButton/>
          </div>
          <Grid
            settings={selectedCampaigns.length === 0}
            headers={campaignHeaders}
            loading={loading}
            scrollable={true}
            search={search}
            selectable={true}
            onLimitChange={onLimitChange}
            completed={completed}
            limit={selectedCampaigns.length > 0 ? false : limit}
            sortable={selectedCampaigns.length <= 0}
            data={campaigns}
            selected={selectedCampaigns}
            onRowClick={::this.onCampaignSelected}
            onSelected={::this.onSelected}
            onLoadNext={onLoadNext}
            theme={styles}
          />
        </div>
      </div>
    );
  }
}
