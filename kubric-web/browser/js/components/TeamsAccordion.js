import { h, Component } from 'preact';
import styles from 'stylesheets/components/teamaccordion';
import appIcons from 'stylesheets/icons/fonticons';
import Accordion from './commons/Accordion';
import { DummyContainer } from "./commons/misc";
import { SearchBox } from "./index";

const Header = ({ heading, description, onClick }) => (
  <div className={styles.header} onClick={onClick}>
    <div className={styles.details}>
      <div className={styles.name}>{heading}</div>
      <div className={styles.desc}>{description}</div>
    </div>
  </div>
);

export default class TeamsAccordion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: -1,
      message: ''
    }
  }

  onTagAction(name, team_id, action, tag) {
    const { updateUsers } = this.props;

    const object = action === 'delete' ? {
      team_id,
      name,
      users: [tag],
      op: "remove"
    } : {
      team_id,
      name,
      users: [tag],
      op: "add"
    }
    this.setState({
      message: action === 'delete' ? `Removed User ${tag} succesffully` : `Email Invitation sent to ${tag}`,
    })
    setTimeout(() => {
      this.setState({
        message: ''
      })
    }, 4000)
    updateUsers && updateUsers(object);
  }

  changeCurrent = (index) => {
    if (this.state.current === index) {
      this.setState({
        current: -1
      })
    } else {
      this.setState({
        current: index
      })
    }
  }

  render() {
    const { teams, profile, deleteTeam, onSubmit, source } = this.props;
    const { message } = this.state;
    const accordionTheme = {
      accordion: styles.accordion,
      section: styles.accordionSection,
      triangle: styles.triangle,
      accordionHeader: styles.accordionHeader
    };
    const filteredTeams = teams.filter(team => team.name !== 'private')
    return (
      <Accordion theme={accordionTheme} onSelect={this.changeCurrent} current={this.state.current}>
        {filteredTeams.map((team) => {
          const { name, owner, users, team_id } = team;
          const userValues = users.map((user) => {
            if (profile === owner) {
              return user
            } else {
              return {
                label: user,
                hideRemove: true
              }
            }
          })

          const actions = profile === owner && team.name !== 'default' ? [<span onClick={deleteTeam.bind(null, team_id)}
                                                                                className={`${appIcons.fonticonDelete} ${styles.delete}`}>&nbsp;</span>,
            <span onClick={onSubmit.bind(null, team)}
                  className={`${appIcons.fonticonEdit} ${styles.delete}`}>&nbsp;</span>] : '';
          const headElement = <Header heading={name} description={<span>{`Owned By: ${owner} `}<span
            className={`${appIcons.fonticonCrown} ${styles.owner}`}></span></span>}/>;

          const userElement = [message.length > 0 ? <h5>{message}</h5> : '',
            <SearchBox disabled={owner === profile} source={owner === profile ? source:[]} theme={styles} label="Users" value={userValues} freeEntry={false}
                       showSelected={true}
                       onSelected={this.onTagAction.bind(this, name, team_id, 'add')}
                       onDeleted={this.onTagAction.bind(this, name, team_id, 'delete')}/>]
          return <DummyContainer headElement={headElement}>
            {actions}{userElement}
          </DummyContainer>
        })}
      </Accordion>
    );
  }
}