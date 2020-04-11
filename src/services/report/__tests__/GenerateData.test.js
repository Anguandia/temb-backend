import moment from 'moment';
import tripService from '../../../modules/trips/trip.service';
import tripMockResults from '../__mocks__/TripsDataMock';
import ReportGeneratorService from '../ReportGeneratorService';

describe('Report Generator Service', () => {
  let reportService;
  const response = tripMockResults;

  beforeAll(() => {
    reportService = new ReportGeneratorService(1);
    jest.spyOn(tripService, 'getAll').mockResolvedValue(response);
  });

  it('should return data to generate report', async () => {
    const tripData = await reportService.generateMonthlyReport();
    expect(tripData).toEqual(response);
  });

  it('should return excel workbook', async () => {
    const tripData = await reportService.generateMonthlyReport();
    const excelWorkBook = reportService.getEmailAttachmentFile(tripData);
    expect(excelWorkBook).toBeInstanceOf(Object);
    expect(excelWorkBook.getWorksheet(1)).toBeInstanceOf(Object);
    expect(excelWorkBook.getWorksheet(1).name).toBe('Summary');
    expect(excelWorkBook.getWorksheet(2).name).toBe('Trip Details');
  });

  it('should return excel file stream', async () => {
    const tripData = await reportService.generateMonthlyReport();
    const excelWorkBook = reportService.getEmailAttachmentFile(tripData);
    const fileStream = await ReportGeneratorService.writeAttachmentToStream(excelWorkBook);
    expect(fileStream.constructor.name).toBe('WriteStream');
    expect(fileStream).toHaveProperty('path');
    expect(fileStream.path).toBe('excel.xlsx');
  });

  it('should raise an error on unsupported report type', () => {
    const willThrows = () => new ReportGeneratorService(undefined, 'unsupported');
    expect(willThrows).toThrow();
  });

  it('should raise an error on unsupported report type when set via property', () => {
    const willThrowAnotherError = () => {
      const err = new ReportGeneratorService(1);
      err.reportType = 'unsupported';
      err.getEmailAttachmentFile([]);
    };
    expect(willThrowAnotherError).toThrow();
  });

  it('should raise an error on tripData that is not an array', () => {
    const willThrowAnotherError = () => {
      const err = new ReportGeneratorService(1);
      err.getEmailAttachmentFile({});
    };
    expect(willThrowAnotherError).toThrow();
  });

  it('should raise an error when workbook passed to writer is not an object', () => {
    const willThrowAnotherError = async () => {
      await ReportGeneratorService.writeAttachmentToStream('not an object');
    };
    expect(willThrowAnotherError()).rejects.toThrow();
  });

  it('should create a summary including percentage change', async () => {
    const result = await ReportGeneratorService.getOverallTripsSummary();
    const lastMonth = moment().subtract(1, 'months');
    const month = lastMonth.format('MMM, YYYY');
    expect(result).toEqual({
      departments: {
        People: { completed: 0, declined: 1, total: 1 },
        null: { completed: 2, declined: 0, total: 2 }
      },
      month,
      percentageChange: '0.00',
      totalTrips: 3,
      totalTripsCompleted: 2,
      totalTripsDeclined: 1
    });
  });
});
