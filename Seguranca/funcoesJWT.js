import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function assinar(usuario){
    const token = jwt.sign({usuario}, 'm1Nh4Ch4v3SeCr3T4', {expiresIn: '600s'});
    return token;
}

export function verificarAssinatura(token){
    return jwt.verify(token, 'm1Nh4Ch4v3SeCr3T4')
}