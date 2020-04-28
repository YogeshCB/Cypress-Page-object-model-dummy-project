import { creativeIterator } from "../jobs/utils";
import services, { serviceManager } from "../services";

let count = 0;
const workspace = "8f0f814f-c698-438c-a632-d575ffee85d3";
const campaignId = "7f830b0c-6fdb-43e8-a0bd-6ecca027cff9";
const token = "Xidj7BkfkbYQSfKt4vsPozBYDBMg5DlFDSAEJVWs2faGP3wZc8c/YJSLX584ydJAtCXPu1TUApjeYdNdm4OtVVSp/SctlN3aFgk9oSMprEc=";

serviceManager.init()
  .then(() => {
    creativeIterator({
      workspace,
      campaignId,
      token
    }, ({ uid: id, source = {} } = {}) => {
      services.campaign.saveAd()
        .send({
          id,
          campaign: campaignId,
          workspace_id: workspace,
          token,
          meta: {}
        })
        .then(() => {
          count++;
          console.log(`Updated - ${count}`);
        })
    });
  });
