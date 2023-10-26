import { HttpException } from '@/exceptions/httpException';
import { UserService } from '@/services/users.service';
import { UserEntity } from '@entities/users.entity';
import { hash } from 'bcrypt';
import Container from 'typedi';

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = Container.get(UserService);
  });

  describe('findAllUser', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ];
      UserEntity.find = jest.fn().mockResolvedValue(mockUsers);
      const result = await userService.findAllUser();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: 1, name: 'User 1' };
      UserEntity.findOne = jest.fn().mockResolvedValue(mockUser);
      const userId = 1;
      const result = await userService.findUserById(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw HttpException if user does not exist', async () => {
      UserEntity.findOne = jest.fn().mockResolvedValue(null);
      const userId = 1;
      await expect(userService.findUserById(userId)).rejects.toThrow(HttpException);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { name: 'New User', email: 'newuser@example.com', password: 'password' };
      const hashedPassword = await hash(userData.password, 10);
      userData.password = hashedPassword;
      UserEntity.findOne = jest.fn().mockResolvedValue(null);
      UserEntity.create = jest.fn().mockReturnValue({ save: jest.fn().mockResolvedValue(userData) });

      const result = await userService.createUser(userData);
      expect(result).toEqual(userData);
    });

    it('should throw HttpException if email already exists', async () => {
      const userData = { name: 'New User', email: 'existing@example.com', password: 'password' };
      UserEntity.findOne = jest.fn().mockResolvedValue(userData);
      await expect(userService.createUser(userData)).rejects.toThrow(HttpException);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 1;
      const userData = { name: 'Updated User', email: 'updated@example.com', password: 'password' };
      const mockUser = { id: userId, ...userData };
      UserEntity.findOne = jest.fn().mockResolvedValue(mockUser);
      UserEntity.update = jest.fn().mockResolvedValue({});
      UserEntity.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.updateUser(userId, userData);
      expect(result).toEqual(mockUser);
    });

    it('should throw HttpException if user does not exist', async () => {
      const userId = 1;
      const userData = { name: 'Updated User', email: 'updated@example.com', password: 'password' };
      UserEntity.findOne = jest.fn().mockResolvedValue(null);

      await expect(userService.updateUser(userId, userData)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = 1;
      const mockUser = { id: userId, name: 'User 1' };
      UserEntity.findOne = jest.fn().mockResolvedValue(mockUser);
      UserEntity.delete = jest.fn().mockResolvedValue({});
      const result = await userService.deleteUser(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw HttpException if user does not exist', async () => {
      const userId = 1;
      UserEntity.findOne = jest.fn().mockResolvedValue(null);

      await expect(userService.deleteUser(userId)).rejects.toThrow(HttpException);
    });
  });
});
