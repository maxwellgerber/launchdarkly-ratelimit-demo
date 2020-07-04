const _ = require('lodash');

const users = [
  {
    username: 'bill',
    userId: '1',
    customerAccountId: '1',
  },
  {
    username: 'joan',
    userId: '2',
    customerAccountId: '1',
  },
  {
    username: 'max',
    userId: '3',
    customerAccountId: '2',
  },
  {
    username: 'edith',
    userId: '4',
    customerAccountId: '2',
  },
  {
    username: 'alice',
    userId: '5',
    customerAccountId: '3',
  },
];

module.exports = {
  users,
  userByUsername: (username) => _.find(users, { username }),
  userByUserId: (userId) => _.find(users, { userId }),
};
