import Joi from '@hapi/joi';
import { startAndEndTime } from '../../../middlewares/validationSchemasExetension';

export const joinRouteSchema = Joi.object().keys({
  manager: Joi.required(),
  workHours: Joi.string().required().regex(startAndEndTime).error(() => ({
    message: 'Invalid time',
  })),
});
