import { config } from 'dotenv';
import http from 'http';
import {
  createNewUser,
  handleNonExistingEndpoints,
  deleteUserById,
  getUserById,
  getUsers,
  updateUser,
  handleServerSideError,
} from './controller';

config();

const PORT = process.env.PORT;

export const server = http.createServer((req, res) => {
  const reqURL = req.url;
  const reqMethod = req.method;

  try {
    switch (reqMethod) {
      case 'GET': {
        if (reqURL === '/api/users') {
          getUsers(req, res);
        } else if (reqURL?.startsWith('/api/users/')) {
          const userId = reqURL.split('/')[3];
          getUserById(userId, req, res);
        } else {
          handleNonExistingEndpoints(req, res);
        }
        break;
      }
      case 'POST': {
        if (reqURL === '/api/users') {
          createNewUser(req, res);
        } else {
          handleNonExistingEndpoints(req, res);
        }
        break;
      }
      case 'PUT': {
        if (reqURL?.startsWith('/api/users/')) {
          const userId = reqURL.split('/')[3];
          updateUser(userId, req, res);
        } else {
          handleNonExistingEndpoints(req, res);
        }
        break;
      }
      case 'DELETE': {
        if (reqURL?.startsWith('/api/users/')) {
          const userId = reqURL.split('/')[3];
          deleteUserById(userId, req, res);
        } else {
          handleNonExistingEndpoints(req, res);
        }
        break;
      }
      default: {
        throw new Error('Invalid request method');
      }
    }
  } catch {
    handleServerSideError(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
