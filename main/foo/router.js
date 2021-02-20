import {LambdaRouter} from "../../lib/lambda-lib";
import Handlers from './handlers';

export const main = LambdaRouter({
  handlers: Handlers,
  idType: 'uuid',
  isPublic: false
});
