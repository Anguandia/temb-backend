import express from 'express';
import ProviderController from '../providers/ProviderController';

const app = express.Router();

/**
 * send an email verification to check if exist
 */

app.post('/providers/verify',
  ProviderController.activateProvider);


export default app;
