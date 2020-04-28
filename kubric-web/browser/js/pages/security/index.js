import { h, Component } from "preact";
import styles from "stylesheets/security/index";
import Grid from "../../components/commons/Table/index";

export default class Security extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { fetchAllAudits } = this.props;
		fetchAllAudits();
	}
	render() {
		const { audits } = this.props;

		const headers = [
			{
				displayName: "User",
				data: "user",
				cellId: "user"
			},
			{
				displayName: "Action",
				data: "action",
				cellId: "action"
			},
			{
				displayName: "Time",
				data: "time",
				cellId: "time",
				theme: {
					cell: styles.time
				}
			}
		];

		return (
			<div className={styles.container}>
				<h3>Security Audits</h3>
				<Grid headers={headers} data={audits} sortable={false} />
			</div>
		);
	}
}
