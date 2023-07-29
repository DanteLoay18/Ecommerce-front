
import bcrypt from 'bcryptjs';


import { isValidToken, signToken } from '@/utils/token';
import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';




export default function handler(req, res) {
    
    switch( req.method ) {
        case 'GET':
            return checkJWT(req, res)

        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const checkJWT = async(req, res )=> {
    
    const { token} = req.cookies;

    let userId = '';

    try {
        userId = await isValidToken( token );

    } catch (error) {
        return res.status(401).json({
            message: 'Token de autorización no es válido'
        })   
    }


    await mongooseConnect();
    const user = await User.findById( userId ).lean();
    

    if ( !user ) {
        return res.status(400).json({ message: 'No existe usuario con ese id' })
    }

    const { _id, email, role, name } = user;

    return res.status(200).json({
        token: signToken( _id, email ),
        user: {
            email, 
            role, 
            name
        }
    })


}
