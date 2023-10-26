import { HttpException } from '@/exceptions/httpException';
import { AuthService } from '@/services/auth.service';
import { UserEntity } from '@entities/users.entity';
import bcrypt from 'bcrypt';
import Container from 'typedi';

describe('AuthService', () => {
  let authService;

  beforeEach(() => {
    authService = Container.get(AuthService);
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const userData = { name: 'New User', email: 'newuser@example.com', password: 'password' };
      UserEntity.findOne = jest.fn().mockResolvedValue(null);
      UserEntity.create = jest.fn().mockReturnValue({ save: jest.fn().mockResolvedValue(userData) });

      const result = await authService.signup(userData);
      expect(result).toEqual(userData);
    });

    it('should throw HttpException if email already exists', async () => {
      const userData = { name: 'Existing User', email: 'existing@example.com', password: 'password' };
      UserEntity.findOne = jest.fn().mockResolvedValue(userData);

      await expect(authService.signup(userData)).rejects.toThrow(HttpException);
    });
  });

  describe('login', () => {
    // it('should log in a user and return a cookie', async () => {
    //   const userData = { email: 'existing@example.com', password: 'password' };
    //   const user = { id: 1, name: 'Existing User', email: userData.email, password: 'password' };
    //   jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

    //   UserEntity.findOne = jest.fn().mockResolvedValue(user);

    //   const result = await authService.login(userData);
    //   expect(result.cookie).toMatch(/Authorization=/);
    //   expect(result.findUser).toEqual(user);
    // });

    it('should throw HttpException if email is not found', async () => {
      const userData = { email: 'nonexistent@example.com', password: 'password' };
      UserEntity.findOne = jest.fn().mockResolvedValue(null);

      await expect(authService.login(userData)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if password does not match', async () => {
      const userData = { email: 'existing@example.com', password: 'wrongpassword' };
      const user = { id: 1, name: 'Existing User', email: userData.email, password: 'password' };
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      UserEntity.findOne = jest.fn().mockResolvedValue(user);
      await expect(authService.login(userData)).rejects.toThrow(HttpException);
    });
  });

  describe('logout', () => {
    it('should return the user when logging out', async () => {
      const userData = { email: 'existing@example.com', password: 'password' };
      const user = { id: 1, name: 'Existing User', email: userData.email, password: 'password' };
      UserEntity.findOne = jest.fn().mockResolvedValue(user);

      const result = await authService.logout(userData);
      expect(result).toEqual(user);
    });

    it('should throw HttpException if the user does not exist', async () => {
      const userData = { email: 'nonexistent@example.com', password: 'password' };
      UserEntity.findOne = jest.fn().mockResolvedValue(null);

      await expect(authService.logout(userData)).rejects.toThrow(HttpException);
    });
  });
});
