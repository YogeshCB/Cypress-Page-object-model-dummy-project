import ssUpload from './ssupload';
import { getConnection } from "../utils";
import { connections } from "../../../isomorphic/sockets";

export default getConnection(connections.CAMPAIGN, {
  handlers: [ssUpload]
});