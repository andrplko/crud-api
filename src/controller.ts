import http from 'http';
import { users } from './database';
import { validate as isValidUUID, v4 as uuidv4 } from 'uuid';
import { User } from './types';

const handleNonExistingEndpoints = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: `API not found at ${req.url}` }));
};

const handleServerSideError = (
  _req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Internal server error' }));
};

const getUsers = (
  _req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.write(
    JSON.stringify({
      data: users,
    })
  );
  res.end();
};

const getUserById = (
  userId: string,
  _req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  const user = users.find((user) => user.id === userId);

  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Incorrect user id' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
};

const createNewUser = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    const { username, age, hobbies } = JSON.parse(data);

    if (!username || !age || !hobbies) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Missing required fields' }));
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };

    users.push(newUser);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  });
};

const updateUser = (
  userId: string,
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  const userToUpdate = users.find((user) => user.id === userId);

  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    const dataToUpdate = JSON.parse(data);

    if (userToUpdate) {
      const index = users.indexOf(userToUpdate);
      const updatedUser = { ...userToUpdate, ...dataToUpdate };
      users[index] = updatedUser;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    } else if (!isValidUUID(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Incorrect user id' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  });
};

const deleteUserById = (
  userId: string,
  _req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  const userToDeleteIndex = users.findIndex((user) => user.id === userId);

  if (userToDeleteIndex !== -1) {
    const deletedUser = users.splice(userToDeleteIndex, 1)[0];
    res.writeHead(204, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(deletedUser));
  } else if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Incorrect user id' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
};

export {
  handleNonExistingEndpoints,
  handleServerSideError,
  getUserById,
  getUsers,
  createNewUser,
  updateUser,
  deleteUserById,
};
