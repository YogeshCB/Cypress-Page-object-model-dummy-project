import parametersPack from './parameters';
import playerPack from './player';
import actions from './actions';
import { getOperations } from "@bit/kubric.redux.reducks.utils";
import { regenerate } from "../creative/operations";
import creativeListPack from "../creatives/list";
import bulkEditSelectors from "../bulkedit/selectors";
import { mergeObjectArrays } from "../../../../lib/utils";
import campaignSelectors from "../selectors";
import notificationActions from "../../notifications/actions";
import { redirect } from "@bit/kubric.utils.common.router";
import { getCampaignUrl } from "../../../../lib/links";
import { at } from "@bit/kubric.utils.common.lodash";

const onGenerate = () => dispatch => {
  const selectedAds = creativeListPack.selectors.getSelectedRows();
  const commonParameters = bulkEditSelectors.getParameters();
  const campaignId = campaignSelectors.getCampaignId();
  selectedAds.forEach(({ source, uid: creativeId, }) => {
    const parameters = mergeObjectArrays(commonParameters, source.parameters);
    const [creativeName] = at(source, "segment.name");
    regenerate(dispatch, parameters, campaignId, creativeId, creativeName, source, {
      showNotifications: false
    });
  });
  dispatch(notificationActions.addNotification({
    type: 'info',
    heading: "Generating creative",
    desc: `Creative generation in progress for ${selectedAds.length} creatives`
  }));
  redirect(getCampaignUrl(campaignId));
};

export default {
  onGenerate,
  ...getOperations(actions),
  ...parametersPack.operations,
  ...playerPack.operations
};