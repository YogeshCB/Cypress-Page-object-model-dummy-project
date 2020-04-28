import actions from './actions';
import { getOperations } from "@bit/kubric.redux.reducks.utils";
import services from '../../../../services';
import selectors from './selectors';
import campaignSelectors from '../selectors';
import { redirect } from "@bit/kubric.utils.common.router";
import { getCampaignUrl } from "../../../../lib/links";
import notificationActions from "../../notifications/actions";
import playerPack from './player';
import parametersPack from './parameters';
import Resolver from '@bit/kubric.utils.common.json-resolver';
import { utilActions } from "../../commons/actions";

export const regenerate = (dispatch, parameters, campaignId, creativeId, creativeName, source = {}, {
  showNotifications = true
} = {}) =>
  services.campaign.saveCreative()
    .notifyStore()
    .send({
      source: {
        ...source,
        parameters
      },
      creativeId,
      campaignId,
    })
    .then(res =>
      services.campaign.singleAdVideo()
        .notifyStore()
        .send({
          campaignId,
          adId: creativeId
        })
        .then(() => {
          showNotifications && dispatch(notificationActions.addNotification({
            type: 'info',
            heading: `Generating creative`,
            desc: `Regenerating with for ${creativeName} with the edited parameters.`
          }));
        }))
    .catch(ex => {
      console.error(ex);
      dispatch(notificationActions.addNotification({
        type: 'error',
        heading: 'Unable to generate video',
        desc: 'We are unable to generate the video right now. Please try after sometime.',
      }));
    });

const onGenerate = () => dispatch => {
  const parameters = selectors.getParameters();
  const campaignId = campaignSelectors.getCampaignId();
  const creativeId = selectors.getCreativeId();
  const creativeName = selectors.getName();
  regenerate(dispatch, parameters, campaignId, creativeId, creativeName, selectors.getSource());
  redirect(getCampaignUrl(campaignId));
};

const getLoadActions = (parameter, patch, isLoading = true) => {
  const action = parametersPack.actions[isLoading ? "parameterLoading" : "parameterLoaded"];
  const actions = Object.keys(patch).map(action);
  actions.push(action(parameter));
  return actions;
};

const onSuggest = (parameter, { request = {}, patch = {} }) => dispatch => {
  const parameters = selectors.getCurrentParameters();
  const resolver = new Resolver();
  const data = [resolver.resolve(request, parameters)];
  dispatch(utilActions.batchedAction(getLoadActions(parameter, patch)));
  services.suggest.getSuggestions()
    .send({
      data
    })
    .then(({ task_id: taskId }) => {
      const intervalId = setInterval(() => {
        services.effects.getTaskStatus()
          .send({
            taskId
          })
          .then(({ status, result: results }) => {
            //result can be null
            if (status === -1) {
              clearInterval(intervalId);
              return false;
            } else if (status === 1) {
              clearInterval(intervalId);
              return results[0] || {};
            }
            return false;
          })
          .then(results => {
            if (results) {
              const parameterPatch = resolver.resolve(patch, results);
              const loadedActions = getLoadActions(parameter, patch, false);
              const valueActions = Object.keys(parameterPatch)
                .map(key => parametersPack.actions.parameterChanged({
                  parameter: key,
                  value: parameterPatch[key]
                }));
              dispatch(utilActions.batchedAction([
                ...loadedActions,
                ...valueActions
              ]));
            }
          });
      }, 2000);
    });
};

export default {
  onGenerate,
  onSuggest,
  ...getOperations(actions),
  ...playerPack.operations,
  ...parametersPack.operations
}