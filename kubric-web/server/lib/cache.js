import cache from '@bit/kubric.server.cache.redis';
import config from 'config';

export default cache(config.get('redis'));