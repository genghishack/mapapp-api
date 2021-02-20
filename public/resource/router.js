import {LambdaRouter} from "../../lib/lambda-lib";
import ResourceHandlers from './handlers';

export const main = LambdaRouter({
  handlers: ResourceHandlers,
  idType: 'uuid',
  isPublic: true
});
