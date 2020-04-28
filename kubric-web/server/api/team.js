import Express from 'express';
import { serviceHelper } from "./utils";

const Router = Express.Router();

// CREATE TEAM
Router.post('/', (req, res, next) => {
    serviceHelper(res, {
      resource: 'team',
      service: 'create',
      data: {
        ...req._sessionData,
        ...req.body,
      },
    });
  });


// GET TEAMS OF A USER
Router.get('/user/:workspaceId', (req, res, next) => {
  serviceHelper(res, {
    resource: 'team',
    service: 'getTeamsOfUser',
    data: {
      ...req._sessionData,
      ...req.query,
      ...req.params
    },
  });
});

// ADD/REMOVE USER TEAM
Router.patch('/user', (req, res, next) => {
    serviceHelper(res, {
      resource: 'team',
      service: 'updateUsers',
      data: {
        ...req._sessionData,
        body: {
          ...req.body,
          workspace_id: req._sessionData.workspace_id
        }
      },
    });
  });


// GET TEAM BY ID
Router.get('/:id', (req, res, next) => {
  serviceHelper(res, {
    resource: 'team',
    service: 'getTeam',
    data: {
      ...req._sessionData,
      ...req.query,
    },
  });
});

// UPDATE TEAM
Router.put('/', (req, res, next) => {
    serviceHelper(res, {
      resource: 'team',
      service: 'update',
      data: {
        ...req._sessionData,
        ...req.body,
        name: req.body.name
      },
    });
  });

// DELETE TEAM
Router.delete('/:id', (req, res, next) => {
    serviceHelper(res, {
      resource: 'team',
      service: 'delete',
      data: {
        ...req._sessionData,
        ...req.params
      },
    });
  });



export default Router;