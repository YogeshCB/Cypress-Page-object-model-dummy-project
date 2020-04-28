import { h, Component } from 'preact';
import { getMediaTime } from "../../../lib/utils";
import { capitalize } from "@bit/kubric.utils.common.lodash";
import MultiText from '../../../components/commons/MultiText';
import { PrimaryButton, StaticField, FieldLabel } from "../../../components/commons/misc";
import { Tag } from "../../../components";
import styles from 'stylesheets/assets/form';

export default class StaticForm extends Component {
  static getValidTags(tags = []) {
    return tags.filter(tag => typeof tag !== 'undefined' && tag.length > 0);
  }

  static getTags({ tags = [] }) {
    return StaticForm.getValidTags(tags).map(tag => <Tag hideRemove={true} label={tag} theme={styles}/>);
  }

  static getDimensions({ width, height }) {
    return (typeof width === 'undefined' && typeof height === 'undefined') ? false : `${width} * ${height}`;
  }

  static getOrientation({ orientation }) {
    return typeof orientation !== 'undefined' ? capitalize(orientation) : false;
  }

  static getDescription({ description = '' }) {
    return description.replace(/\n/g, ' ').trim();
  }

  static getLength({ length }) {
    return typeof length !== 'undefined' ? getMediaTime(length) : false;
  }

  static getAssetUrl({ url }) {
    return typeof url !== 'undefined' ? url : null;
  }

  render() {
    const { asset = {}, showLicenseModal, selected } = this.props;
    const description = StaticForm.getDescription(asset);
    const dimensions = StaticForm.getDimensions(asset);
    const orientation = StaticForm.getOrientation(asset);
    const length = StaticForm.getLength(asset);
    const tags = StaticForm.getTags(asset);
    const url = StaticForm.getAssetUrl(asset);
    const asset_type = asset.asset_type;
    const source = asset.source_website;
    return (
      <div className={styles.staticForm}>
        {selected.length > 1 && <h3>Selected {selected.length} asset{selected.length > 1 ? 's' : ''}</h3>}

        {source === 'shutterstock' ? <PrimaryButton onClick={showLicenseModal.bind(null, asset.id, asset_type)}>
          License Asset
        </PrimaryButton> : ''}
        <br/>
        {description.length > 0 ? <MultiText className={styles.desc} delay={50}>{description}</MultiText> :
          <span/>}
        {url ? <a className={styles.url} target="_blank" href={url}>
          <StaticField label="URL" theme={styles} dark enableCopy value={url}/>
        </a> : <span/>}
        {length ? <StaticField label="Length" value={length}/> : <span/>}
        {dimensions ? <StaticField label="Dimensions" value={dimensions}/> : <span/>}
        {orientation ? <StaticField label="Orientation" value={orientation}/> : <span/>}
        {tags.length > 0 ? (
          <div>
            <FieldLabel>Tags</FieldLabel>
            <div>
              {tags}
            </div>
          </div>
        ) : <span/>}
      </div>
    );
  }
}