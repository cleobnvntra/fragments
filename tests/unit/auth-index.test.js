describe('testing authorization to be used', () => {
  afterEach(() => {
    jest.resetModules();
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.HTPASSWD_FILE;
    delete process.env.NODE_ENV;
  });

  test('must require ./cognito if AWS_COGNITO variables are defined', () => {
    process.env.AWS_COGNITO_POOL_ID = 'us-east-1_E5DOVfgcD';
    process.env.AWS_COGNITO_CLIENT_ID = '3rvvph5t8gjhk6prkckcnd987e';
    const auth = require('../../src/authorization');
    expect(auth).toBe(require('../../src/authorization/cognito'));
  });

  test(
    'must require ./basic-auth when HTPASSWD_FILE is set' +
      ' and NODE_ENV is not production and AWS_COGNITO variables are undefined',
    () => {
      process.env.HTPASSWD_FILE = 'tests/.htpasswd';
      process.env.NODE_ENV = 'development';
      const auth = require('../../src/authorization');
      expect(auth).toBe(require('../../src/authorization/basic-auth'));
    }
  );

  test('throw error when missing required env variables', () => {
    expect(() => require('../../src/authorization')).toThrowError();
  });

  test('throw error when env variables are invalid', () => {
    process.env.AWS_COGNITO_POOL_ID = 'invalid-pool-id';
    process.env.AWS_COGNITO_CLIENT_ID = 'invalid-client-id';
    process.env.HTPASSWD_FILE = 'invalid-passwd-file';
    process.env.NODE_ENV = 'invalid-node-env';
    expect(() => require('../../src/authorization')).toThrowError();
  });
});
