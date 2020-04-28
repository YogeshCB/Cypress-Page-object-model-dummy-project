import Express from 'express';
import { serviceHelper } from "./utils";
import _ from 'lodash';

const Router = Express.Router();

export const storyboardsTransformer = res => {
  let storyboards = [];
  if (Array.isArray(res.data)) {
    storyboards = res.data
      .reduce((acc, { previews = [], ...storyboard }) => {
        const preview = previews.slice(-1).pop();
        if (typeof preview.url !== 'undefined') {
          acc.push({
            ...storyboard,
            video: {
              videoURL: preview.url,
              thumbnailURL: preview.thumbnail,
              watermarkURL: preview.watermark_url,
            }
          });
        }
        return acc;
      }, []);
  } else {
    storyboards = [];
  }
  return {
    storyboards,
    next: res.next,
  };
};

Router.get('/', (req, res, next) => {
  const service = !_.isUndefined(req.query.ids) ? 'getBulk' : 'get';
  serviceHelper(res, {
    resource: 'storyboards',
    service,
    data: {
      ...req._sessionData,
      ...req.query
    },
    transformer: storyboardsTransformer,
  });
});

export default Router;