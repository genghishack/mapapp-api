import {LambdaRouter} from "../lib/lambda-lib";
import ResourceHandlers from './resource/handlers';

export const router = LambdaRouter({
  handlers: ResourceHandlers,
  idType: 'uuid',
  isPublic: false
});
