import Express from 'express';
import { serviceHelper } from "./utils";

const Router = Express.Router();

export const templatesTransformer =
  res => res.data
    .map(({ storyboard, ...rest }) => {
      const { previews = [], shots = [], ...sbRest } = storyboard;
      return {
        ...rest,
        storyboard: {
          ...sbRest,
          shots: shots.map(({ previews = [], ...shotRest }) => ({
            ...shotRest,
            defaultVideo: {
              videoURL: previews.slice(-1).pop().url,
              thumbnailURL: previews.slice(-1).pop().thumbnail,
            },
          })),
          defaultVideo: {
            videoURL: previews.slice(-1).pop().url,
            thumbnailURL: previews.slice(-1).pop().thumbnail,
          },
        },
      };
    });

Router.get('/', (req, res, next) => {
  serviceHelper(res, {
    resource: 'templates',
    service: 'get',
    data: {
      ...req._sessionData,
    },
    transformer: templatesTransformer,
  });
});

export default Router;