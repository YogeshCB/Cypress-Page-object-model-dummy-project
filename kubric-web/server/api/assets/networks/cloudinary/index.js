import { serviceHelper } from '../../../utils';
import Express from 'express';

const Router = Express.Router();

Router.post('/sync', (req, res) => {
    serviceHelper(res, {
      resource: 'cloudinary',
      service: 'syncCloudinary',
      data: {
        ...req._sessionData,
        ...req.body
      }
    })
})
  
Router.delete('/', (req, res) => {
    serviceHelper(res, {
        resource: 'cloudinary',
        service: 'disconnect',
        data: {
            ...req._sessionData
        }
    })
})

export default Router;