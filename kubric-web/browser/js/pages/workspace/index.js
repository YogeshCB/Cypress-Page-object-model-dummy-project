import { h, Component } from 'preact';
import Teams from './Teams';
import Users from './Users';
import Field from '../../components/commons/Field';
import styles from 'stylesheets/workspace/manage';
import { Spinner } from "../../components";
import CreateWorkspace from '../commons/CreateWorkspace';
import { PrimaryButton, SecondaryButton, LinkButton } from '../../components/commons/misc';
import Modal from '../../components/commons/Modal';
import SelectBox from '../../components/commons/SelectBox';
import { isValidEmail, capitalize } from '../../lib/utils';

class ManageWorkspace extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      workspace_id: props.workspace_id || undefined,
      loading: false,
      showSettings: false,
      name: '',
      confirmDeleteModal: false,
      search: false,
      newWorkspace: '',
      role: ''
    }
  }

  showConfirmDelete = () => {
    this.setState({
      confirmDeleteModal: !this.state.confirmDeleteModal
    })
  }

  onChange = (user) => {
    this.setState({
      user
    })
  }

  onSubmitInvitation = () => {
    const { addUserToWorkspace, workspace } = this.props;
    const { user, role } = this.state;

    const { workspace_id, name } = workspace;
    if (role.length > 0 && isValidEmail(user)) {
      addUserToWorkspace && addUserToWorkspace({
        workspace_id,
        name,
        users_old: [user],
        users: {
          [user]: [role],
        },
        op: "add"
      })
      this.setState({
        user: '',
        message: `Invitation Sent to ${user} Succesfully`,
      })
    } else {
      this.setState({
        message: 'Invalid Email or Role not selected'
      })
    }
    setTimeout(() => {
      this.setState({
        message: '',
        search: false
      })
    }, 800)
  }

  toggleSettings = (action) => {
    this.setState({
      showSettings: !this.state.showSettings,
      newWorkspace: action,
    })
  }

  toggleSearch = () => {
    this.setState({
      search: !this.state.search
    })
  }

  changeRole = (role) => {
    this.setState({
      role
    })
  }
  
  render() {
    const { showSettings, confirmDeleteModal, user, newWorkspace, message, role } = this.state;
    const { deleteWorkspace, workspace, loading, isOwner, email, roles } = this.props;

    const { workspace_id, name } = workspace;

    const options = roles.map((role) => {
      return {
        label: capitalize(role.name),
        value: role.uid,
        data: role.uid
      }
    });
    const inviteElement = <div className={styles.invite}>
      <Field theme={styles} placeholder="Type Email" value={user} onChange={this.onChange}/>
      <SelectBox onChange={this.changeRole} value={role} label={'Role'} theme={styles} options={options}></SelectBox>
      <LinkButton className={styles.send} onClick={this.onSubmitInvitation}>Send</LinkButton>
    </div>

    return loading ? <Spinner theme={styles} noOverlay/> : <span><div className={`${styles.flex} ${styles.nav}`}>
        <h2 className={styles.name}>{name}</h2>
        <div className={styles.actions}>        
          <LinkButton theme={styles} className={styles.toggle} onClick={this.toggleSettings.bind(null, 'newWorkspace')}>Create
            Workspace</LinkButton>
          {isOwner &&
          <LinkButton theme={styles} className={`${styles.toggle} ${styles.delete}`} onClick={this.showConfirmDelete}>Delete
            Workspace&nbsp;</LinkButton>}
          </div>
        </div>
        <div className={`${styles.container}`}>      
        <span>{message}</span>
        <div className={styles.flex}>
          <Users inviteElement={inviteElement}/>
          <Teams/>      
        </div>
        <Modal visible={showSettings} onHide={this.toggleSettings}><CreateWorkspace newWorkspace={newWorkspace}
                                                                                    workspace_id={workspace_id}/></Modal>
        <Modal visible={confirmDeleteModal} onHide={this.showConfirmDelete}>
          Are you sure you want to delete <b>"{`${name}`}"</b>?
          <br/>
          <br/>
          <br/>
          <PrimaryButton onClick={deleteWorkspace.bind(null, workspace_id)}>Confirm</PrimaryButton>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <SecondaryButton onClick={this.showConfirmDelete}>Cancel</SecondaryButton>
        </Modal>
      </div></span>
  }
}

export default ManageWorkspace;