import { resolve } from 'path';
import fs from 'fs';
import BugsnagHelper from '../helpers/bugsnagHelper';
import EmailService from '../modules/emails/EmailService';
require('../load-env');

export default class UploadWeeklyTemplate extends EmailService  {
  constructor() {
    super();
  }

  pushTemplate = async () => {
    try {
      const path = resolve(__dirname, '../views/email/weeklyReport.html');
      const template = fs.readFileSync(path).toString();
      const domain = process.env.MAILGUN_DOMAIN;
      const body = await this.client.post(`/${domain}/templates`, {
        template,
        name : 'weekly',
        description: 'Template used to send weekly report of taken trips',
        engine: 'handlebars',
      });
      console.log(body);
    } catch (e) {
      BugsnagHelper.log(e);
    }
  }
}

const uploadTemplate = new UploadWeeklyTemplate();
uploadTemplate.pushTemplate();
