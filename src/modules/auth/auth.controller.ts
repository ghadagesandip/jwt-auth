import { Application, NextFunction, Request, Response } from 'express';
import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';
import * as responsehandler from '../../lib/response-handler';
import ApiError from '../../abstractions/ApiError';
import BaseApi from '../../components/BaseApi';
import { IServerTimeResponse, IResourceUsageResponse, IProcessInfoResponse, ISystemInfoResponse } from '../../components/system-status/system-status.types';
import { AuthLib } from './auth.lib';

/**
 * Status controller
 */
export default class AuthController extends BaseApi {

    constructor(express: Application) {
        super();
        this.register(express);
    }

    public register(express: Application): void {
        express.use('/api/auth', this.router);
        this.router.post('/login', this.login);
        this.router.post('/signup', this.signup);
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const  userLib = new AuthLib()
            const { email, password } = req.body;
            const loggedInUser: any = await userLib.loginUserAndCreateToken(
                email,
                password,
            );
            res.locals.data = loggedInUser;
            responsehandler.send(res);
        } catch (err) {
            next(err);
        }
    }

    public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const  userLib = new AuthLib()
            const userResult = await userLib.saveUser(req.body)
            res.locals.data = userResult;
            responsehandler.send(res);
        } catch (err) {
            next(err);
        }
    }
    
}
