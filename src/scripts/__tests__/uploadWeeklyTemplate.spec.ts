import UploadWeeklyTemplate from '../uploadWeeklyTemplate';

describe('UploadWeeklyTemplate', () => {
  let upload: any;

  beforeEach(() => {
    upload = new UploadWeeklyTemplate();
    upload.client.post = async (link: string, info: any) =>  new Promise(
        (resolve, reject) => resolve('Template stored.'));
  });

  it('should upload weekly Template', async () => {
    jest.spyOn(console, 'log');
    await upload.pushTemplate();
    expect(upload.client).toBeDefined();
    expect(console.log).toHaveBeenCalledWith('Template stored.');
  });
});
