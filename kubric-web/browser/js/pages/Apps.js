import Apps from './apps/index';
import { connect } from 'preact-redux';
import { getCampaignsUrl, getStudioUrl } from "../lib/links";

export default connect(state => ({
  campaignsUrl: getCampaignsUrl(),
  studioUrl: getStudioUrl()
}), {})(Apps);