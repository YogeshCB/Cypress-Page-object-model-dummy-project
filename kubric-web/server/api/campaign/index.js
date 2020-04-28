import Express from 'express';
import injectGetRoutes from './get';
import injectSaveRoutes from './save';
import injectResolutionRoutes from './resolution';
import injectVideoGenerationRoutes from './videogeneration';
import injectCreateRoutes from './create';
import injectCreativesRoutes from './creatives';
import injectDownloadRoutes from './download';
import injectDeleteRoutes from './delete';

const Router = Express.Router();

injectGetRoutes(Router);
injectSaveRoutes(Router);
injectResolutionRoutes(Router);
injectVideoGenerationRoutes(Router);
injectCreateRoutes(Router);
injectCreativesRoutes(Router);
injectDownloadRoutes(Router);
injectDeleteRoutes(Router);

export default Router;