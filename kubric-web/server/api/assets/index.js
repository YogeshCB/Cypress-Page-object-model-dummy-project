import Express from 'express';
import { serviceHelper } from '../utils';
import shutterstockServices from '../../services/shutterstock';
import config from 'config';
import isImage from 'is-image';
import services from '../../services';
import isVideo from 'is-video';
import ingestDataTransformers from './ingest';
import driveRouter from './networks/drive/index';
import cloudinaryRouter from './networks/cloudinary/index';
import shutterstockRouter from './networks/shutterstock/index';
import mimeTypes from 'mime-types';
import colorConvert from 'color-convert';
import _ from 'lodash';

const Router = Express.Router();

const isFont = (file) => file.lastIndexOf('.ttf') > -1 || file.lastIndexOf('.otf') > -1;
const isAudio = (file) => file.lastIndexOf('.mp3') > -1;
const isZip = (file) => file.lastIndexOf('.zip') > -1;
const imageExceptions = (file) => file.lastIndexOf('.svg') > -1 || file.lastIndexOf('.ai') > -1 || file.lastIndexOf('.eps') > -1;
const assetSize = 50;

Router.use('/networks/shutterstock', shutterstockRouter);
Router.use('/networks/drive', driveRouter);
Router.use('/networks/cloudinary', cloudinaryRouter);

const networkResponseTransformer = (req, network, response) => {
  if(network === 'cloudinary') {
    return {
      hits: response.folders.map(folder=>{ return {
        id: `${new Date().getTime()}_${folder.name}`,
        name: folder.name,
        path: folder.path,
        asset_type: 'folder',
        url: "None",
        shared_with: [],
        description: folder.name
      }}),
      applied_filters: {},
      total: response.total_count,
      path: "/root",
      workspaceId: req._sessionData.workspaceId,
      folder_name: 'Home',
      path_names: ["Home"]
    }
  }
  else {
    return {
      hits: [],
      applied_filters: {},
      total: 0,
      path: "/root",
      workspaceId: req._sessionData.workspaceId,
      folder_name: 'Home',
      path_names: ["Home"]
    }
  }
}

const networkPicker = (req, res) => {
  services.assets.getIntegrations()
  .send({
    ...req._sessionData
  })
  .then(response => {
    serviceHelper(res, {
      resource: req.query.context,
      service: 'getAssets',
      data: {
        ...response[req.query.context]
      },
      transformer: (response) => {
        return networkResponseTransformer(req, req.query.context, response)
      }
    })
  })
}

Router.get('/search', (req, res, next) => {
  let data = {
    ...req.query,
    ...req._sessionData,
  };
  if (req.query.private === 'true') {
    data.userId = req._sessionData.email;
  }
  if(req.query.context && req.query.context !== 'kubric') { 
    networkPicker(req, res)
  }
  else {

    if (req.query.constraints && req.query.constraints.indexOf('shutterstock')>-1) {    
      const promises = [services.shutterstock.getCredentials().send({
        ...req._sessionData
      }).catch(err=>{
        res.status(401).send({
          status: 401,
          error: 'You have not authorized your shutterstock account'
        })
      })];
      Promise.all(promises).then(response=>{
        shutterstockServices.shutterstock.getAssets()
          .send({
            ...req._sessionData,
            q: req.query.q,
            size: req.query.size,
            page: Number(req.query.from)>=assetSize? (Number(req.query.from)/assetSize)+1 : 1
          })
          .then(response=>{
            let { data, meta, ...obj } = response;
            data = data.map(({ id, attributes, ...rest }) => {
              return {
                ...rest,
                asset_type: 'image',
                created_time: "",
                download: attributes.src,
                file_type: attributes.src.substr(attributes.src.lastIndexOf('.')),
                height: attributes.height,
                width: attributes.width,
                url: attributes.src,
                owner: "public",
                path: "/root",
                path_names: [],
                source_id: id,
                id,
                source_website: "shutterstock",
                user_id: "public",
            }
            });
            res.status(200).send({
              ...obj,
              applied_filters: {},
              hits: data,
              total: meta.pagination.total_pages,
              size: meta.pagination.page_size,
              path: "/root",
              workspaceId: req._sessionData.workspaceId,
              folder_name: 'Home',
              path_names: ["Home"]
            })
          })
          .catch(err=> {
            console.log(err);
            res.status(401).send({
              status:401,
              hits: [],
              error: 'You have not authorized your Shutterstock account. Please do so in the profile section.'
            });
          })
      })
    }
    else {
      serviceHelper(res, {
        resource: 'assets',
        service: 'get',
        data,
        transformer: {
          response(res) {
            let { hits = [], ...rest } = res;
            hits = hits.map(({ color, palette, created_time, ...hitRest }) => {
              if (!_.isUndefined(color)) {
                const { h, s, v } = color;
                const rgb = colorConvert.hsv.hex.raw([h, s, v]);
                color = {
                  ...color,
                  rgb
                };
              }
              if (!_.isUndefined(palette)) {
                palette = palette.map(patch => {
                  return colorConvert.rgb.hex(patch);
                })
              }
              if (!_.isUndefined(created_time)) {
                created_time = new Date(`${created_time}Z`);
              }
              return {
                ...hitRest,
                color,
                palette,
                created_time
              };
            });
            return {
              ...rest,
              hits,
            };
          },
          error(err) {
            if (err.status === 404 || err.status === 403) {
              return {
                status: 200,
                error: JSON.parse(err.response.text)
              };
            } else {
              return {
                status: err.status,
                error: JSON.parse(err.response.text)
              }
            }
          }
        }
      })
    }
  }
});

Router.get('/filters', (req, res, next)=>{
  serviceHelper(res, {
    resource: 'assets',
    service: 'getFilters',
    data: {
      ...req._sessionData,
    }
  });

})
Router.get('/uploadurls', (req, res, next) => {
  let { file = [], attributes = '[]', tags = [], path , variant} = req.query;
  attributes = JSON.parse(attributes);
  if (!Array.isArray(file)) {
    file = [file];
  }
  if (!Array.isArray(tags)) {
    tags = [tags];
  }
  const fileData = file.map(filename => {
    const type = isImage(filename) && !imageExceptions(filename) ? 'image' : isVideo(filename) ? 'video' : isAudio(filename) ? 'audio' :
      isZip(filename) ? 'archive' : isFont(filename) ? 'font' : 'blob';
    if (type === 'font') {
      return {
        type,
        user_id: req._sessionData.email,
        filename,
        path,
        mime_type: mimeTypes.lookup(filename)
      }
    } else {
      return {
        type,
        user_id: req._sessionData.email,
        filename,
        path
      }
    }
  });
  serviceHelper(res, {
    resource: 'assets',
    service: 'getUploadUrls',
    data: {
      ...req._sessionData,
      origin: config.get('root'),
      details: fileData,
      tags, 
      custom_attributes: attributes,
      variant
    },
  });
});

Router.post('/confirmupload', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'confirmUpload',
    data: {
      ...req._sessionData,
      data: req.body,
    },
  });
});

Router.put('/update/bulk', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'bulkUpdate',
    data: {
      ...req._sessionData,
      ...req.body,
    },
  });
});

Router.patch('/', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'saveVariant',
    data: {
      ...req._sessionData,
      ...req.body
    }
  });
});

Router.patch('/share/folders', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'shareFolders',
    data: {
      ...req._sessionData,
      ...req.body,
    },
  });
});

Router.patch('/', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'deleteVariant',
    data: {
      ...req._sessionData,
      ...req.body,
    },
  });
});

Router.patch('/share/assets', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'shareAssets',
    data: {
      ...req._sessionData,
      ...req.body,
    },
  });
});

Router.patch('/unshare/folders', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'unshareFolders',
    data: {
      ...req._sessionData,
      ...req.body,
    },
  });
});

Router.patch('/unshare/assets', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'unshareAssets',
    data: {
      ...req._sessionData,
      ...req.body,
    },
  });
});

Router.post('/newfolder', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'newFolder',
    data: {
      ...req._sessionData,
      ...req.body,
    },
  });
});

Router.put('/update/path/bulk', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'moveToFolder',
    data: {
      ...req._sessionData,
      ...req.body,
    },
  });
});

Router.post('/update', (req, res, next) => {
  if (req.body.asset_type === 'folder') {
    serviceHelper(res, {
      resource: 'assets',
      service: 'saveFolder',
      data: {
        ...req._sessionData,
        user_id: req._sessionData.email,
        ...req.body,
      },
    });
  } else {
    serviceHelper(res, {
      resource: 'assets',
      service: 'save',
      data: {
        ...req.body,
        ...req._sessionData,
        user_id: req._sessionData.email,
      },
    });
  }
});

Router.post('/delete', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'delete',
    data: {
      ...req._sessionData,
      body: req.body,
    }
  });
});


Router.delete('/folder/:id', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'deleteFolder',
    data: {
      ...req._sessionData,
      ...req.query,
      ...req.params,
    }
  });
});

Router.get('/folder/zip/:id', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'download',
    data: {
      ...req._sessionData,
      ...req.query,
      ...req.params,
    }
  });
});

Router.get('/folder/unzip/:id', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'unzip',
    data: {
      ...req._sessionData,
      ...req.query,
      ...req.params,
    }
  });
});

Router.post('/ingest/:source', (req, res, next) => {
  const source = req.params.source;
  const dataTransformer = ingestDataTransformers[source];
  let body = req.body;
  if (dataTransformer) {
    body = dataTransformer(body);
  }
  if(req.params.source === 'cloudinary') {
    serviceHelper(res, {
      resource: 'cloudinary',
      service: 'validateCloudinary',
      data: {
        ...req._sessionData,
        ...req.body
      },
      transformer: {
        error(err) {
          res.status(401).send({
            status: 401,
            error: 'Unable to sync. Please check the credentials.'
          })
        }
      }
    }).then(resp=>{
      serviceHelper(res, {
        resource: 'assets',
        service: 'ingest',
        data: {
          sourceData: {
            ...body,
            source,
          },
          ...req._sessionData,
        },
        transformer: {
          response: (response) => {
            res.status(200).send(response)
          }
        }
      });
    })
  }
  else {
    serviceHelper(res, {
      resource: 'assets',
      service: 'ingest',
      data: {
        sourceData: {
          ...body,
          source,
        },
        ...req._sessionData,
      },
    });
}
});

Router.get('/:id', (req, res, next) => {
  serviceHelper(res, {
    resource: 'assets',
    service: 'getAsset',
    data: {
      ...req.params,
      ...req._sessionData,
    },
  });
});

export default Router;