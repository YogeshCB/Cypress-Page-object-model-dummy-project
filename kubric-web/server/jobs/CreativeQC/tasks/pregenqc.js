import services from '../../../services';
import poll from "polling-to-event";
import mergeData from "@bit/kubric.media.video.mergeshots";

const getAttributeMap = ({ attributes = [] }) =>
  attributes.reduce((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {});

const mergeShots = async data => {
  const { ad } = data;
  const { source = {} } = ad;
  const { templates = [], parameters = [] } = source;
  return templates.map((shot, shotId) => mergeData(shot, parameters[shotId], {
    resolveAudio: false
  }));
};

const adUpdater = (data, qcStatus, qcScore, qcResults) => {
  const { ad, campaignId: campaign, workspace, token } = data;
  const { uid: adId } = ad;
  return services.campaign.saveAd()
    .send({
      workspace_id: workspace,
      campaign,
      id: adId,
      token,
      qcStatus,
      qcResults,
      qcScore
    });
};

export default async (data, progress, resolve, reject) => {
  const { ad, token, workspace } = data;
  const { source = {}, meta } = ad;
  const { templates = [], segment } = source;
  const { assets = {} } = JSON.parse(meta);

  if (templates.length === 0) {
    resolve();
  } else {
    try {
      //Generating frames
      const mergedShots = await mergeShots(data);
      //Initiating QC
      const { task_id: taskId } = await services.qc.shotsQC()
        .send({
          token,
          workspace_id: workspace,
          storyboard: mergedShots,
          assets,
          segment: getAttributeMap(segment),
        });
      const pollEmitter = poll(async done => {
        try {
          let response = await services.qc.getTaskStatus()
            .send({
              token,
              taskId
            });
          done(null, response);
        } catch (ex) {
          done(ex);
        }
      }, {
        interval: 2000, //polled every 2 secs
        longpolling: true,  //emits the 'longpoll' event when last poll data differs from the one before that
      });
      pollEmitter.on('longpoll', async task => {
        try {
          const { status, result } = task;
          const { errors = [], qc_status: qcStatus, qc_score: qcScore } = result || {};
          if (status === 1) {
            await adUpdater(data, qcStatus === 1 ? 'passed' : 'failed', qcScore, errors);
            pollEmitter.clear();
            resolve();
          } else if (status === -1) {
            await adUpdater(data, 'failed', qcScore, []);
            pollEmitter.clear();
            reject(task);
          } else if (status === 0) {
            await adUpdater(data, 'inprogress', qcScore, []);
          }
        } catch (ex) {
          pollEmitter.clear();
          reject(ex);
        }
      });
      pollEmitter.on('error', err => {
        pollEmitter.clear();
        reject(err);
      });
    } catch (ex) {
      reject(ex);
    }
  }
};