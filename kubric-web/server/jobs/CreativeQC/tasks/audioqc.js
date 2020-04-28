import _ from 'lodash';
import services from '../../../services';
import poll from "polling-to-event";

export default async (data, progress, resolve, reject) => {
  const { ad, token } = data;
  const videoUrl = _.get(ad, 'content.video.url');
  if (!videoUrl || videoUrl.length === 0) {
    resolve();
  } else {
    try {
      const { task_id: taskId } = services.audio.qc()
        .send({
          token,
          videoUrl
        });
      const pollEmitter = poll(async done => {
        try {
          let response = await services.tasks.getStatus()
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
      pollEmitter.on('longpoll', task => {
        const { status } = task;
        if (status === 1) {
          pollEmitter.clear();
          resolve();
        } else if (status === -1) {
          pollEmitter.clear();
          reject(task);
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