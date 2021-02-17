import {LambdaRouter} from "../lib/lambda-lib";
import FooHandlers from './foo/handlers';

export const router = LambdaRouter({
  handlers: FooHandlers,
  idType: 'uuid',
  isPublic: false
});
