import Express from 'express';
import { serviceHelper } from "./utils";

const Router = Express.Router();

Router.delete('/:id', (req, res) => {
  serviceHelper(res, {
    resource: 'events',
    service: 'postEvent',
    data: {
      ...req._sessionData,
      beta: process.env.NODE_ENV === "production" ? "false" : "true",
      eventData: {
        "action": "notification-read",
        "created_by": "system",
        "created_on": (new Date()).getTime(),
        "data": {
          "who": req._sessionData.email,
          "where": "in-app",
          "when": "instant",
          "what": {
            "notification_id": req.params.id,
            "workspace_id": req._sessionData.workspace_id,
          }
        }
      }
    }
  });
});

export default Router;