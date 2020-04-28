import { h } from "preact";
import { MenuItem } from "../../../../../components/commons/Menu";
import styles from "stylesheets/content/headermenu";
import InitialIcon from "../../../../../components/commons/InitialIcon";

export default ({ workspaces = [], id, setWorkspace }) => {
	const otherWorkspaces = workspaces.filter(workspc => id !== workspc.workspace_id).sort((a, b) => a.name.localeCompare(b.name));
	const activeWorkspace = workspaces.filter(workspc => id === workspc.workspace_id);
	return (
		<span className={otherWorkspaces.length > 0 ? styles.workspaceContainer : ""}>
			{[...activeWorkspace, ...otherWorkspaces].map(workspace => {
				const isActiveWorkspace = id === workspace.workspace_id;
				return (
					<MenuItem
						className={styles.workspaceMenu}
						theme={styles}
						onClick={setWorkspace.bind(null, workspace.workspace_id)}
						disabled={isActiveWorkspace}
						key={`headermenu-${workspace.name}`}>
						<InitialIcon name={workspace.name} tick={isActiveWorkspace} {...isActiveWorkspace && { color: "rgba(41, 20, 107, 0.7)" }} />
						<p className={`${isActiveWorkspace ? styles.active : ""}`}>&nbsp;&nbsp;{workspace.name}</p>
					</MenuItem>
				);
			})}
		</span>
	);
};
