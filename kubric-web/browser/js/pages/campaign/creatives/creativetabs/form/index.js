import { h, Component } from 'preact';
import Drawer from '../../../../../components/commons/Drawer';
import Video from '../../../../../components/commons/media/Video';
import Image from '../../../../../components/commons/media/Image';
import styles from 'stylesheets/campaign/form';
import { StaticField, SolidButton } from "../../../../../components/commons/misc";
import { isString, at, mapValues } from "@bit/kubric.utils.common.lodash";
import fontIcons from 'stylesheets/icons/fonticons';
import { isVideo, getVideoCardProperties } from "../../../../utils/video";
import { campaignStates, isCampaignState } from "../../../../../../../isomorphic/constants/queue";
import { Tabs, Tab } from "../../../../../components/commons/Tabs";
import Chatter from '../../../../commons/Chatter';
import { statuses } from "../../../../../../../isomorphic/constants/creatives";
import { stringifyJson } from "../../../../../../../isomorphic/utils";
import { getFullDate } from "../../../../../lib/date";

const TabHeader = ({ className }) => <div className={`${styles.tabheader} ${className}`}/>;

const ValidationErrors = ({ errors = [] }) => (
  <div className={`${styles.attributesContainer} ${styles.validation}`}>
    <div className={styles.header}>Invalid columns</div>
    <div className={styles.attributes}>
      {
        errors.map(({ colName, description }) => (
          <div className={styles.attribute}>
            <span className={`${styles.label}`}>{colName}:</span>
            <span className={`${styles.value}`}>{description}</span>
          </div>
        ))
      }
    </div>
  </div>
);

const Attributes = ({ attributes = [], meta = {}, showInferred = true }) => {
  const { errors = [] } = meta;
  let colIds = [];
  errors.map(error => {
    mapValues(error, (o) => {
      colIds.push(o.column.colId);
    });
  });
  if (attributes.length > 0) {
    return <div className={styles.attributesContainer}>
      <div className={styles.header}>Parameters</div>
      <div className={styles.attributes}>
        {attributes.reduce((acc, { display_name: label, value }) => {
          if (showInferred || (!showInferred && !/^s(?:\d)+\//.test(label))) {
            acc.push(
              <div className={`${styles.attribute} ${meta && colIds.indexOf(label) > -1 ? styles.error : {}}`}>
                {meta && colIds.indexOf(label) > -1 ?
                  <span className={`${fontIcons.fonticonWarning} ${styles.errorIcon}`}>&nbsp;&nbsp;</span> : ''}
                <span
                  className={`${styles.label} ${meta && colIds.indexOf(label) > -1 ? styles.erroredLabel : {}}`}>{label}:</span>
                <span
                  className={`${styles.value} ${meta && colIds.indexOf(label) > -1 ? styles.erroredValue : {}}`}>{value}</span>
              </div>
            );
          }
          return acc;
        }, [])}
      </div>
    </div>
  } else {
    return <span/>;
  }
};

const QCResults = ({ results = [] }) => (
  <div className={styles.qcresults}>
    {results.map(message => <div className={styles.result}>{message}</div>)}
  </div>
);

export default class Form extends Component {
  constructor(props) {
    super(props);
    const [wurl] = at(props, 'data.media.watermarkURL');
    const [url] = at(props, 'data.media.videoURL');
    this.state = {
      versionId: '',
      url: wurl || url || ''
    };
  }

  setTab(creative, tab) {
    const { onPaneltabChanged } = this.props;
    onPaneltabChanged(tab);
  }

  versionSelector(active, url) {
    if (active === this.state.versionId) {
      this.setState({
        versionId: '',
        url: this.props.data.media.watermarkURL || ''
      });
    } else {
      this.setState({
        versionId: active,
        url: url ? url : ''
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { selected: currentSelected = [] } = this.props.data;
    const { selected: newSelected = [] } = nextProps.data;
    if (currentSelected.join() !== newSelected.join()) {
      this.setState({
        url: ''
      });
    }
  }

  getSelectedAdsData() {
    const { data, formData, isSelectedDirty } = this.props;
    const { results: creatives, selected = [] } = data;
    if (selected.length > 0) {
      if (selected.length > 1) {
        if (!isSelectedDirty) {
          return {
            text: '',
            headline: '',
            description: '',
          };
        } else {
          return formData;
        }
      } else {
        const { content = {}, source = {}, uid, status, generated_creatives: generatedCreatives, qc_status: qcStatus, qc_results: qcResults, meta } = creatives[selected[0]];
        const { text, headline, description, video = {} } = content;
        let { segment } = {};
        if (source && source.segment) {
          segment = source.segment;
        }
        const { name: audId, display_name: audName, attributes = [] } = segment;
        const isInGeneration = isCampaignState(status, campaignStates.GENERATION) || isCampaignState(status, campaignStates.CREATION);
        const isGenerated = status === statuses.GENERATION_COMPLETED;
        let data = {
          text,
          headline,
          generatedCreatives,
          description,
          audId,
          meta: stringifyJson(meta, {}),
          qcStatus,
          qcResults: qcResults ? JSON.parse(qcResults) : '',
          attributes,
          uid,
          isInGeneration,
          isGenerated
        };
        if (selected.length === 1) {
          data = {
            ...data,
            media: {
              videoURL: video.url,
              thumbnailURL: video.thumbnail,
              watermarkURL: video.watermarkUrl,
            },
          };
        }
        return data;
      }
    }
    return {};
  }

  onChange(value, name) {
    const { onSelectedRowsChange } = this.props;
    onSelectedRowsChange && onSelectedRowsChange({
      [name]: value,
    });
  }

  onHide() {
    const { onClearRowSelections, onPaneltabChanged } = this.props;
    onClearRowSelections();
    onPaneltabChanged("discuss");
  }

  render() {
    const { data = {}, onEdit, gridImage, showInferred = true, tab } = this.props;
    const { selected = [] } = data;
    const selectedCreative = this.getSelectedAdsData();
    const {
      media = {}, generatedCreatives = [], audId, isInGeneration, isGenerated, attributes = [], meta, qcResults = []
    } = selectedCreative;
    const show = selected.length > 0;
    const { versionId, url } = this.state;
    let videoMedia = {
      thumbnailURL: media.thumbnailURL,
      videoURL: url === '' ? media.videoURL : url,
      watermarkURL: url === '' ? media.videoURL : url
    };
    const { validationErrors = [] } = meta;
    return (
      <Drawer show={show} onHide={::this.onHide} theme={styles} heading={''}>
        <Tabs onTabOpened={this.setTab.bind(this, selectedCreative)} selected={tab}>
          <Tab label={<TabHeader className={fontIcons.fonticonInfo}/>} id="overview">
            <div className={styles.overview}>
              {isString(media.videoURL) ?
                <div className={styles.fieldsContainer}>
                  <StaticField theme={{ ...styles, value: styles.url }} label="URL" value={videoMedia.videoURL} dark
                               enableCopy={true}/>
                </div> :
                <span/>}
              {isInGeneration ? (<div className={styles.fieldsContainer}>
                  <StaticField label="Name" value={audId}/>
                  {validationErrors.length > 0 ? <ValidationErrors errors={validationErrors}/> : <span/>}
                  {qcResults.length > 0 ? <QCResults results={qcResults}/> : <span/>}
                  <Attributes meta={meta} attributes={attributes} showInferred={showInferred}/>
                </div>
              ) : (
                <span/>
              )}
            </div>
          </Tab>
          <Tab label={<TabHeader className={fontIcons.fonticonChat}/>} id="discuss">
            <Chatter data={selectedCreative}/>
          </Tab>
          <Tab label={<TabHeader className={fontIcons.fonticonVersions}/>} id="version">
            <div className={styles.versions}>
              <div className={styles.line}/>
              {generatedCreatives && generatedCreatives.length > 1 ? generatedCreatives.map((version, index) => {
                const createdOn = new Date(version.created_on);
                return <div
                  className={`${styles.version} ${versionId === version.uid || (versionId === '' && index === 0) ? styles.versionActive : {}}`}
                  onClick={this.versionSelector.bind(this, version.uid, version.url)}>
                  <div className={styles.line}/>
                  <div
                    className={`${styles.bullet} ${versionId === version.uid || (versionId === '' && index === 0) ? styles.bulletActive : {}}`}/>
                  <div className={styles.versionDetail}>
                    <span>{getFullDate(createdOn)}</span> by <span>{version.created_by}</span>
                    {versionId === version.uid || (versionId === '' && index === 0) &&
                    <div className={styles.difference}>
                      {version.description}
                    </div>}
                  </div>
                </div>
              }) : <span className={styles.message}>No Versions to show.</span>}
            </div>
          </Tab>
        </Tabs>
        {tab === "overview" ? (
          <div className={styles.actions}>
            <SolidButton onClick={onEdit} className={styles.edit}>Edit</SolidButton>
          </div>
        ) : <span/>}
        {isGenerated ? (isVideo(media) ? (
          <Video hoverable={false} card={false} muted={false} {...getVideoCardProperties(videoMedia)}
                 theme={{ modalContainer: styles.creativeModal }} modal={true}/>
        ) : <Image gridImage={gridImage} modal={true} image={url === '' ? media.videoURL : url}
                   theme={{ modalContainer: `${styles.creativeModal} ${styles.imageModal}` }}/>) : <span/>}
      </Drawer>
    );
  }
}

