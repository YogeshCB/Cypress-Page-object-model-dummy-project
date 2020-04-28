import CreativeEditor from './creativeeditor/index';
import { connect } from "preact-redux";
import DataFetcher, { getFetcherHandlers, getServiceHandler } from "../../mixins/DataFetcher";
import services from "../../services";
import creativeOperations from '../../store/objects/campaign/creative/operations';
import creativeActions from '../../store/objects/campaign/creative/actions';
import creativeSelectors from '../../store/objects/campaign/creative/selectors';
import useSelectors from "../../store/objects/user/selectors";
import { isUndefined, at } from "@bit/kubric.utils.common.lodash";
import campaignSelectors from "../../store/objects/campaign/selectors";
import store from "../../store";

const getSbIdFromContext = context => at(context, "location.params.id")[0];

const getAdStoryboard = () => {
  const ad = creativeSelectors.creative();
  if (!isUndefined(ad)) {
    const { bindingIndex } = ad.source;
    if (!isUndefined(bindingIndex)) {
      return campaignSelectors.getLinkedStoryboard(bindingIndex);
    }
  }
  return false;
};

const DataFetchedComponent = DataFetcher({
  component: CreativeEditor,
  objects: {
    creative: {
      ...getFetcherHandlers(creativeActions.creativeFetched, {
        postFetched({ uid }) {
          const adStoryboard = getAdStoryboard(uid);
          if (adStoryboard) {
            const { id: storyboard, version } = adStoryboard;
            services.storyboard.get()
              .send({
                storyboard,
                version
              })
              .then(sbData => store.dispatch(creativeActions.storyboardFetched(sbData)))
          }
        }
      }),
      service: getServiceHandler(services.campaign.getAd),
      shouldAvoidFetching() {
        const currentCreative = creativeSelectors.creative();
        //If the user is navigating from the creatives page, the creative will already be set when the row selection happens
        return !useSelectors.isWorkspaceSet() || !isUndefined(currentCreative);
      },
      fetcherData: {
        campaignId: "{{context.location.params.campaign}}",
        adId: "{{context.location.params.id}}"
      },
    },
    storyboard: {
      ...getFetcherHandlers(creativeActions.storyboardFetched),
      service: getServiceHandler(services.storyboard.get),
      shouldAvoidFetching({ context }) {
        const storyboard = getAdStoryboard(getSbIdFromContext(context));
        // Means that this is a template linked campaign ad
        if (!storyboard) {
          return true;
        } else {
          const { loaded } = storyboard;
          return loaded;
        }
      },
      fetcherData({ context }) {
        const { id: storyboard, version } = getAdStoryboard(getSbIdFromContext(context));
        return {
          storyboard,
          version
        }
      }
    }
  }
});

export default connect(state => ({
  name: creativeSelectors.getName(state),
  shotCount: creativeSelectors.getShots(state).length
}), {
  ...creativeOperations,
})(DataFetchedComponent);