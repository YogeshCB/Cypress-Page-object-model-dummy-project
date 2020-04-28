import securityOperations from "../store/objects/security/operations";
import securitySelectors from "../store/objects/security/selectors";
import { connect } from "preact-redux";
import Security from "./security/index";

export default connect(
	state => ({
		audits: securitySelectors.getAudits(state)
	}),
	{
		...securityOperations
	}
)(Security);
