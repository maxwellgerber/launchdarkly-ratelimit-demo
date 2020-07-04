const supertest = require('supertest');

require('should');

const app = require('./index');

describe('The server', () => {
  let request;

  beforeEach(() => {
    request = supertest.agent(app);
  });

  it('Login with in-memory datastore works ', async () => {
    const { body } = await request
      .post('/login')
      .send({
        username: 'max',
        password: 'max',
      })
      .expect(200);

    body.should.match({ username: 'max' });
  });

  it('Login with in-memory datastore works - negative test', async () => {
    await request
      .post('/login')
      .send({
        username: 'invalid',
        password: 'invalid',
      })
      .expect(401);
  });

  it('Cannot access protected resource when we are not logged in', async () => {
    await request
      .get('/protected')
      .expect(401);
  });

  it('Can access protected resource when we are logged in', async () => {
    await request
      .post('/login')
      .send({
        username: 'max',
        password: 'max',
      })
      .expect(200);

    await request
      .get('/protected')
      .expect(200);
  });

  describe('Rate limiting', () => {
    const asUser = async (username) => {
      request = supertest.agent(app);
      await request
        .post('/login')
        .send({
          username,
          password: username,
        })
        .expect(200);

      return request;
    };

    const expect200NTimes = async (agent, N) => {
      for (let i = 0; i < N; i++) {
        await agent.get('/protected').expect(200);
      }
    };
    const expect429 = async (agent) => {
      await agent.get('/protected').expect(429);
    };

    it('Bill has the default limit of 3', async () => {
      request = await asUser('bill');
      await expect200NTimes(request, 3);
      await expect429(request);
    });

    it('Joan has the default limit of 3', async () => {
      request = await asUser('joan');
      await expect200NTimes(request, 3);
      await expect429(request);
    });

    it('Max has unlimited requests since he is an admin', async () => {
      request = await asUser('max');
      await expect200NTimes(request, 100);
    });

    it('Edith has a limit of 10 since she is in account 2', async () => {
      request = await asUser('edith');
      await expect200NTimes(request, 10);
      await expect429(request);
    });

    it('Alice is suspended and can only make a single', async () => {
      request = await asUser('alice');
      await expect200NTimes(request, 1);
      await expect429(request);
    });
  });
});
