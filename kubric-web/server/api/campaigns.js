import Express from 'express';
import { serviceHelper, getDate } from "./utils";

const Router = Express.Router();

export const campaignsTransformer = response => {
  const { data = [], next, totalHits } = response;
  return {
    data: data.map(campaign => ({
      ...campaign,
      desc: getDate(campaign.created_on),
      updatedOnString: getDate(campaign.updated_on)
    })),
    next: next,
    total: totalHits
  };
};

Router.get('/', (req, res, next) => {
  if (typeof req.query.limit === 'undefined') {
    req.query.limit = 30;
  }
  serviceHelper(res, {
    resource: 'campaigns',
    service: 'get',
    data: {
      ...req._sessionData,
      ...req.query,
      ...req.params,
    },
    transformer: campaignsTransformer,
  });
});

Router.patch('/', (req, res, next) => {
  serviceHelper(res, {
    resource: 'campaigns',
    service: 'share',
    data: {
      ...req._sessionData,
      ...req.body
    }
  })
})

export default Router;