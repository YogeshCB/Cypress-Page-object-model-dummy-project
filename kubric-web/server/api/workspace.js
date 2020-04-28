import Express from 'express';
import { serviceHelper } from "./utils";

const Router = Express.Router();

//CREATE WORKSPACE
Router.post('/', (req, res) => {
  serviceHelper(res, {
    resource: 'workspace',
    service: 'create',
    data: {
      ...req._sessionData,
      ...req.body
    },
  });
});

const setWorkspaceId = async (req, res) => {
  const workspace_id = req.body.workspace_id;
  await req._sessionCache.setSession(req._sessionData.userid, {
    ...req._sessionData,
    workspace_id
  });

  res.status(200).send({
    workspace_id: req.body.workspace_id,
    message: 'Workspace Changed Successfully'
  });
};
// GET INVITATIONS 
Router.get('/:workspaceId/invite', (req, res) => {
  serviceHelper(res, {
    resource: 'workspace',
    service: 'getInvitations',
    data: {
      ...req._sessionData,
      ...req.params,
      ...req.query,
    },
  });
})

// REVOKE INVITATION
Router.delete('/invite/:token_id', (req, res) => {
  serviceHelper(res, {
    resource: 'workspace',
    service: 'revokeInvitation',
    data: {
      ...req._sessionData,
      ...req.params,
    },
  });
})

//SET WORKSPACE ID IN SESSION DATA
Router.post('/set', setWorkspaceId);

//ADD/REMOVE USER WORKSPACE
Router.patch('/', (req, res) => {
  serviceHelper(res, {
    resource: 'workspace',
    service: 'updateUsers',
    data: {
      ...req._sessionData,
      body: {
        ...req.body
      }
    },
  });
});

//GET WORKSPACES OF A USER
Router.get('/', (req, res) => {
  serviceHelper(res, {
    resource: 'workspace',
    service: 'getWorkspacesOfUser',
    data: {
      ...req._sessionData,
      ...req.query,
    },
  });
});

Router.get('/users', (req, res) => {
  const { workspace_id: workspaceId } = req._sessionData;
  serviceHelper(res, {
    resource: 'workspace',
    service: 'get',
    data: {
      ...req._sessionData,
      workspaceId,
      userInfo: true,
      fetchRoles: false
    }
    ,
    transformer({ data = {} }) {
      return data.user_details;
    }
  });
});

//GET WORKSPACE BY ID
Router.get('/:workspaceId', (req, res) => {
  serviceHelper(res, {
    resource: 'workspace',
    service: 'get',
    data: {
      ...req._sessionData,
      ...req.query,
      ...req.params
    },
  });
});

//UPDATE WORKSPACE
Router.put('/', (req, res) => {
  serviceHelper(res, {
    resource: 'workspace',
    service: 'update',
    data: {
      ...req._sessionData,
      ...req.body,
      name: req.body.name
    },
  });
});

//DELETE WORKSPACE
Router.delete('/:workspaceId', (req, res) => {
  serviceHelper(res, {
    resource: 'workspace',
    service: 'delete',
    data: {
      ...req._sessionData,
      ...req.params
    },
  });
});

export default Router;