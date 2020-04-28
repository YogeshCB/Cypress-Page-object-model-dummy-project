import { h, Component } from 'preact';
import { PrimaryButton } from '../../../components/commons/misc';
import Field from '../../../components/commons/Field';
import styles from 'stylesheets/components/workspace';
import { Spinner } from "../../../components";

class Create extends Component {

  constructor(props) {
    super(props);
    const { workspace_id, users, teams, name, meta } = props.workspace || {}
    const newWorkspace = props.newWorkspace === 'newWorkspace';
    this.state = {
      name: newWorkspace ? '' : name,
      meta: newWorkspace ? '' : meta,
      message: '',
      workspace_id: newWorkspace ? '' : workspace_id,
      users: users,
      teams: teams,
      loading: false
    }
  }

  onWorkspaceDataChanged = (name, val) => {
    if (name === 'name') {
      this.setState({
        name: val
      })
    } else if (name === 'meta') {
      this.setState({
        meta: val
      })
    }
  };

  onSubmit = () => {
    const { name, meta, workspace_id, users, teams } = this.state;
    const { owner, createWorkspace, updateWorkspace, newWorkspace } = this.props;

    if (name.length === 0) {
      this.setState({
        message: 'Name cannot be empty'
      })
    } else {
      this.setState({
        message: ''
      })
      if (newWorkspace === 'newWorkspace') {
        createWorkspace && createWorkspace({
          name,
          meta,
          owner
        })
      } else {
        updateWorkspace && updateWorkspace({
          name,
          meta,
          owner,
          workspace_id,
          users,
          teams
        })
      }
    }
  };

  render() {
    const { name, meta } = this.state;
    const { loading, newWorkspace } = this.props;

    return (
      <div>
        {!loading ? <div className={styles.create}>
          <h3 className={styles.header}>{newWorkspace === 'newWorkspace' ? 'Create a workspace' : 'Edit'}</h3>
          <Field label="Name" name="name" value={name} onChange={this.onWorkspaceDataChanged.bind(null, 'name')}/>
          <Field label="Description" name="meta" value={meta}
                 onChange={this.onWorkspaceDataChanged.bind(null, 'meta')}/>
          {this.state.message.length > 0 ? this.state.message : ''}
          <PrimaryButton
            onClick={this.onSubmit}>{newWorkspace === 'newWorkspace' ? 'Create Workspace' : 'Update Workspace'}</PrimaryButton>
        </div> : <Spinner theme={styles} noOverlay/>}
      </div>
    );
  }
}

export default Create;