import { h, Component } from 'preact';
import googleClientAPI from 'google-client-api';
import styles from 'stylesheets/components/commons/drive';
import config from '../../config';
import { Tag } from "../index";

export default class DriveFilePicker extends Component {
  constructor(props) {
    super(props);
    this.setState({
      loaded: false
    });
  }

  onAuthApiLoad = () => {
    const { client_id, scopes } = this.props;
    gapi.auth2.init({ client_id, scope: scopes[0] }).then((googleAuth) => {
      googleAuth.signIn({ scope: scopes[0] }).then((result) => {
        this.handleAuthResult(result.getAuthResponse());
      })
    });
  }
  componentWillMount() {
    googleClientAPI().then(gapi => {      
      //gapi.load('auth2', this.onAuthApiLoad);
      gapi.load('picker', this.buildPicker);      
    });
  }

  handleAuthResult = (authResult) => {
    if (authResult && !authResult.error) {
      oauthToken = authResult.access_token;
      this.buildPicker(oauthToken);
    }
  }


  buildPicker = (accessToken) => {
    accessToken = accessToken || this.props.accessToken;
    if (typeof google !== 'undefined' && typeof accessToken !== 'undefined') {
      const docsView = new google.picker.DocsView()
        .setIncludeFolders(true)
        .setMimeTypes('application/vnd.google-apps.folder')
        .setSelectFolderEnabled(true);

      this.picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .addView(docsView)
        .setOAuthToken(accessToken)
        .setDeveloperKey(config.gapi.developerKey)
        .setCallback(this.onPicked)
        .build();
      this.setState({
        loaded: true,
      });
    }
  }

  componentWillReceiveProps({ accessToken: nextAccessToken }) {
    if (this.props.accessToken !== nextAccessToken) {
      this.setState({
        loaded: false,
      });
      this.buildPicker(nextAccessToken);
    }
  }

  onPicked = ({ action, docs }) => {
    if (action === 'picked') {
      this.props.onAddFolder(docs);
    }
  }

  onOpen() {
    this.state.loaded && this.picker.setVisible(true);
  }

  getFolders() {
    const { folders = [], onDeleteFolder } = this.props;
    return (folders || []).map(({ name, id, url }) => (
      <Tag key={`selected_folder_${id}`} onRemove={onDeleteFolder.bind(null, id)}>
        <a href={url} target="_blank">{name}</a>
      </Tag>)
    );
  }

  render() {
    const { loaded } = this.state;
    return (
      <div className={`${!loaded ? styles.disabled : ''} ${styles.drive}`}>
        <div className={styles.label}>Sync folders</div>
        <div className={`${!loaded ? styles.disabled : ''} ${styles.folders}`}>
          {this.getFolders()}
          <Tag hideRemove={true} onClick={::this.onOpen}>+Add folder</Tag>
        </div>
      </div>
    );
  }
}