import {LambdaRouter} from "../lib/lambda-lib";
import UserHandlers from './user/handlers';

export const router = LambdaRouter({
  handlers: UserHandlers,
  idType: 'uuid',
  isPublic: false
});
