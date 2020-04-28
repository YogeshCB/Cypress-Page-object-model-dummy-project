import { getByIds }from "@bit/kubric.redux.state.utils";

const resolveCampaigns = ({ campaignsById, campaignIds }) => getByIds(campaignsById, campaignIds);

const resolveSelected = ({ selected: selectedCampaigns }) => {
  return Object.keys(selectedCampaigns).reduce((acc, rowId) => {
    const { selected, index } = selectedCampaigns[rowId];
    if (selected) {
      acc.push(index);
    }
    return acc;
  }, []);
};

export default {
  resolveCampaigns,
  resolveSelected
};