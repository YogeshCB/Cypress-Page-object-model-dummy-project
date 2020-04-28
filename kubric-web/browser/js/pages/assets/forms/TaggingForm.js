import { h, Component } from 'preact';
import { LinkButton } from "../../../components/commons/misc";
import styles from 'stylesheets/assets/taggingForm';
import appIcons from 'stylesheets/icons/app';
import { Spinner, SearchBox } from "../../../components";

export default class TaggingForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: []
    }
  }

  onTagAction = (action, tag) => {
    const { assets, selected, onRowValueDelete, onRowValueAppend } = this.props;
    const { tags } = this.state;
    const fn = action === 'delete' ? onRowValueDelete : onRowValueAppend;
    if (action !== 'delete') {
      this.setState({
        tags: [...tags, tag]
      })
    } else {
      this.setState({
        tags: tags.filter(tg => tg !== tag)
      })
    }
    selected.map(asset => {
      fn && fn({
        id: assets[asset].id,
        field: 'tags',
        data: tag,
      });
    })
  };

  confirmBulkTag = (tags, ids) => {
    const { confirmBulkTag } = this.props;
    confirmBulkTag({ tags, ids });
    this.setState({
      tags: []
    })
  };

  render() {
    const { assets, selected, tagFormLoading } = this.props;
    const { tags } = this.state;
    const ids = selected.map(asset => assets[asset].id);
    return (
      <div className={`${styles.editForm}`} ref={node => this.form = node}>
        {tagFormLoading ? <Spinner theme={styles} noOverlay/> :
          <SearchBox label="Tags" value={tags} freeEntry={true} showSelected={true}
                     onSelected={this.onTagAction.bind(this, 'append')}
                     onDeleted={this.onTagAction.bind(this, 'delete')} theme={{ tag: styles.activeTag }}/>}
        <div className={`${styles.actions} ${styles.taggingFormActions}`}>
          <LinkButton theme={styles} onClick={this.confirmBulkTag.bind(this, tags, ids)}>
            <span className={`${appIcons.iconSave} ${styles.saveIcon}`}/>&nbsp;Save
          </LinkButton>
        </div>
      </div>
    );
  }
};