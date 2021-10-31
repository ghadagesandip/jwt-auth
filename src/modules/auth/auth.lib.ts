import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import authModel from '../user/user.model';



export class AuthLib {

    public async generateHash(password: string): Promise<string> {
        return bcrypt.hashSync(password, 10);
    }

    public async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compareSync(password, hash);
    }

    public async saveUser(userData): Promise<any>{
        
        userData.password = await this.generateHash(userData.password);
        const userObj = new authModel(userData);
        return userObj.save();
    }

    public async getUserByEmail(email: string): Promise<any> {
        return authModel.findOne({ email: email }, '+password');
    }

    public async loginUserAndCreateToken(email, password): Promise<any>{

        let userData: any = await this.getUserByEmail(email);
        if (userData !== null) {
            const isValidPass: boolean = await this.comparePassword(
              password,
              userData.password,
            );
            if (isValidPass) {
              let token: string;
              let SECRET: string =process.env.SECRET;
      
              userData.password = undefined;
              token = jwt.sign({ id: userData._id, userRole: userData.userRole, jti: 'test' }, SECRET, {
                expiresIn: '24h',
              });
      
              return { userData, token };
            } else {
              throw new Error('INVALID_CREDENTIALS');
            }
        } else {
            throw new Error('INVALID_CREDENTIALS');
        }
        
    }

}