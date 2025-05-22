import UserModel, { User, UserCreateDTO, UserLoginDTO } from "../models/User";

class UserService {
  public static _instance: UserService;

  public static getInstance(): UserService {
    if (!UserService._instance) {
      UserService._instance = new UserService();
    }
    return UserService._instance;
  }

  public async createUser(data: UserCreateDTO): Promise<User> {
    const user = await UserModel.create(data);
    return user.toObject();
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? user.toObject() : null;
  }

  public async findUserById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? user.toObject() : null;
  }

  public async updateUser(
    id: string,
    data: Partial<UserCreateDTO>
  ): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return user ? user.toObject() : null;
  }

  public async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }
}

const userService = UserService.getInstance();

export default userService;
