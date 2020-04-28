import servicePackGenerator from '@bit/kubric.redux.packs.service';
import { getService } from "../../../services";

const homeServicesPack = servicePackGenerator({
  typePrefix: 'kubric/home/services'
});

export const campaignFetched = homeServicesPack(getService('campaigns.get'));
