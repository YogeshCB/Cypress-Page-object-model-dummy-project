import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/drive';
import Picker from '../../pages/Picker';
import { LinkButton } from './misc';


export default class CloudinaryFilePicker extends Component {
  constructor(props) {
    super(props);
    this.setState({
      loaded: false,
    });
  }

  render() {
    const { pickAsset, isPickerOpen, onAddFolder } = this.props;
    return (<div className={`${styles.drive}`}>
        <div className={styles.label}>Sync Folders</div>
        <Picker isPickerOpen={isPickerOpen}/>
        <div className={`${styles.folders}`}>
          <LinkButton onClick={pickAsset.bind(null, { single: false, type: 'folder', network: 'cloudinary', callback: onAddFolder })}>+Add folder</LinkButton>                  
        </div>
      </div>
    );
  }
}