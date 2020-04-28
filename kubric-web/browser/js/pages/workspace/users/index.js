import { h, Component } from 'preact';
import fontIcons from 'stylesheets/icons/fonticons';
import styles from 'stylesheets/workspace/users';
import InitialIcon from '../../../components/commons/InitialIcon';
import Modal from '../../../components/commons/Modal';
import { PrimaryButton, SecondaryButton, LinkButton } from '../../../components/commons/misc';
import Field from '../../../components/commons/Field';
import { capitalize } from '../../../lib/utils';

export default class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showConfirmation: false,
      user: '',
      search: true,
      users: props.users? Object.keys(props.users) : [],
      query: '',
      invitation:'',
      deleteUser: ''
    }
  }

  onDeleteConfirmation = () => {
    const { deleteUserFromWorkspace, workspace } = this.props;

    const { workspace_id, name } = workspace;
    const { deleteUser } = this.state;
    deleteUserFromWorkspace && deleteUserFromWorkspace({
      workspace_id,
      name,
      users: [deleteUser],
      op: "remove"
    });
    this.onDeleteUser('');
  }

  onDeleteUser = (user) => {
    this.setState({
      showConfirmation: !this.state.showConfirmation,
      deleteUser: user
    });
  }

  onMouseOver = (user, type) =>{
    if(type === 'invitation') {
      this.setState({
        invitation: user
      })
    }
    else if(type === 'user'){
      this.setState({
        user
      })
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      users: props.users ? Object.keys(props.users) : []
    })
  }
  onMouseOut = (user, type) =>{
    if(type === 'invitation') {
      this.setState({
        invitation: ''
      })
    }
    else if(type === 'user') {
      this.setState({
        user:''
      })
    }
  }
  enableInvite = () => {
    this.setState({
      search: !this.state.search
    })
  }
  onSearch = (value) => {
    const users = Object.keys(this.props.users);

    let matcher = new RegExp(value, "i");
    this.setState({
      query: value
    })
    
    this.setState({
      users: users.filter(user=> {
        let found = matcher.test(user);
        if(found){
          return user
        }
      })
    })
  }
  render() {
    const { email, isOwner, isAdmin, workspace, invitations, inviteElement, revokeInvitation } = this.props;
    const { showConfirmation, user, deleteUser, search, users = [], query, invitation: token } = this.state;    
    const userRoles = this.props.users;
    
    const searchElement = <Field icon iconClass={fontIcons.iconSearch} theme={styles} placeholder="Search" value={query} onChange={this.onSearch}/>
    return (
      <div className={styles.users}>
      <h3 className={styles.head}>Members ({users.length}) {isOwner || isAdmin?<LinkButton className={styles.invite} onClick={this.enableInvite}>{search ? 'Invite':'Search'}</LinkButton>:''}</h3>        
        {search ? searchElement : inviteElement}

        {invitations.length > 0 ? <span className={styles.smallHead}>Pending</span>:''}
        {invitations.map((invitation) => {
          return <h4 onMouseLeave={this.onMouseOut.bind(null, '', 'invitation')} onMouseEnter={this.onMouseOver.bind(null, invitation.token_id, 'invitation')} className={styles.user}>
            <InitialIcon name={invitation.user_id}/>&nbsp;&nbsp;{invitation.user_id}            
            {token === invitation.token_id?<span className={`${styles.close} ${fontIcons.fonticonClose}`} onClick={revokeInvitation.bind(null, invitation.token_id)}></span>:''}</h4>
        })}
        {users.length > 0 ? <span className={styles.smallHead}>Members</span>:''}
        <h4 className={styles.user}>
          <InitialIcon name={workspace.owner}/>&nbsp;&nbsp;{workspace.owner}&nbsp;
            <span className={`${fontIcons.fonticonCrown} ${styles.invite}`}></span>
        </h4>
        {users.map((usr) => {
          return usr === workspace.owner ? null : <h4 onMouseLeave={this.onMouseOut.bind(null, '', 'user')} onMouseEnter={this.onMouseOver.bind(null, usr, 'user')} className={styles.user}>
          <InitialIcon name={usr}/>&nbsp;&nbsp;{usr}&nbsp;
            {email === usr || (!isOwner && !isAdmin) ? <span className={styles.delete} style={{color:'rgba(0,0,0,0.6)'}}>{capitalize(userRoles[usr][0].name)}</span> :
              user === usr ? <span onMouseEnter={this.onMouseOver.bind(null, usr)} onClick={this.onDeleteUser.bind(this, usr)}
                    className={`${fontIcons.fonticonDelete} ${styles.delete}`}/>:<span className={styles.delete} style={{color:'rgba(0,0,0,0.6)'}}>{capitalize(userRoles[usr][0].name)}</span>}</h4>
        })}
        <Modal onHide={this.onDeleteUser} visible={showConfirmation}>
          Are you sure you want to remove {deleteUser}?
          <br/>
          <br/>
          <br/>
          <PrimaryButton onClick={this.onDeleteConfirmation.bind(this, user)}>Confirm</PrimaryButton>&nbsp;&nbsp;
          <SecondaryButton onClick={this.onDeleteUser}>Cancel</SecondaryButton>
        </Modal>
      </div>
    );
  }
}
