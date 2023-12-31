
import bcrypt from 'bcryptjs';


import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import { signToken } from '@/utils/token';
import { isValidEmail } from '@/utils/validations';



export default function handler(req, res) {
    
    switch( req.method ) {
        case 'POST':
            return registerUser(req, res)

        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const registerUser = async(req, res) => {
    
    const { email, password, name} = req.body;

    if ( password.length < 6 ) {
        return res.status(400).json({
            message: 'La contraseña debe de ser de 6 caracteres'
        });
    }

    if ( name.length < 2 ) {
        return res.status(400).json({
            message: 'El nombre debe de ser de 2 caracteres'
        });
    }
    
    if ( !isValidEmail( email ) ) {
        return res.status(400).json({
            message: 'El correo no tiene formato de correo'
        });
    }
    
    
    await mongooseConnect();
    const user = await User.findOne({ email });
    console.log(user)

    if ( user ) {
        return res.status(400).json({
            message:'No puede usar ese correo'
        })
    }

    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync( password ),
        role: 'client',
        name,
    });

    try {
        await newUser.save({ validateBeforeSave: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        })
    }
   
    const { _id, role } = newUser;

    const token = signToken( _id, email );

    return res.status(200).json({
        token, //jwt
        user: {
            email, 
            role, 
            name,
        }
    })


}
