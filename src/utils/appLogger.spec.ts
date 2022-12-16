import * as crypto from 'crypto';
import { AppLogger } from './appLogger';

describe('AppLogger', () => {
  let appLogger: AppLogger;
  const mockCorrelationId = '33999170-7f14-4f19-ac5b-437165a77958'

  beforeEach(() => {
    global.correlationId = ''
    appLogger = new AppLogger();
  });

  it('should log a message with correlationId saved on global object', () => {
    global.correlationId = mockCorrelationId
    jest.spyOn(appLogger, 'log');


    const message = JSON.stringify({
      correlationId: mockCorrelationId,
      message: 'Some message to log'
    });
    const context = 'Some context';
    appLogger.logger({ message: 'Some message to log' }, context);

    expect(appLogger.log).toHaveBeenCalledWith(message, context);
  });

  it('should log a message with correlationId received on request', () => {
    jest.spyOn(appLogger, 'log');
    
    const message = JSON.stringify({
      correlationId: mockCorrelationId,
      message: 'Some message to log'
    });
    const context = 'Some context';
    appLogger.logger({
      headers: {
        'x-correlation-id': mockCorrelationId
      },
      message: 'Some message to log'
    }, context);
    expect(global.correlationId).toBe(mockCorrelationId);
    expect(appLogger.log).toHaveBeenCalledWith(message, context);
  });

  it('should generate correlationId when receive header without value', () => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => mockCorrelationId),
    jest.spyOn(appLogger, 'log');
    
    const message = JSON.stringify({
      correlationId: mockCorrelationId,
      message: 'Some message to log'
    });
    const context = 'Some context';
    appLogger.logger({
      headers: {},
      message: 'Some message to log'
    }, context);
    expect(global.correlationId).toBe(mockCorrelationId);
    expect(appLogger.log).toHaveBeenCalledWith(message, context);
  })
});
