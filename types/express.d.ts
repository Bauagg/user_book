// @types/express.d.ts
import { TokenPayload } from "../src/utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
