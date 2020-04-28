import { h } from 'preact';
import { connect } from "preact-redux";
import fontIcons from "stylesheets/icons/fonticons";
import { DropDownButton } from "../../../../components/commons/misc";
import { Menu, MenuItem } from "../../../../components/commons/Menu";
import creativesOperations from '../../../../store/objects/campaign/creatives/operations';

const reportsButton = <DropDownButton icon={fontIcons.fonticonDownloadOutline}>Download</DropDownButton>;

const Button = ({ onStatusReport, onErrorReport, onDownloadCreatives }) => (
  <Menu iconElement={reportsButton}>
    <MenuItem onClick={onStatusReport}>Status Report</MenuItem>
    <MenuItem onClick={onErrorReport}>Error Report</MenuItem>
    <MenuItem onClick={onDownloadCreatives}>All creatives</MenuItem>
  </Menu>
);

export default connect(() => ({}), {
  ...creativesOperations
})(Button);