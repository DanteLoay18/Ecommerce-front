import  { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import { signToken } from '@/utils/token';


export default function handler(req, res) {
    
    switch( req.method ) {
        case 'POST':
            return loginUser(req, res)
        case 'PUT':
            return actualizar(req, res)
        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const loginUser = async(req, res) => {
    
    const { email = '', password = ''  } = req.body;

    await mongooseConnect();
    const user = await User.findOne({ email });
    

    if ( !user ) {
        return res.status(400).json({ message: 'Correo o contraseña no válidos - EMAIL' })
    }
    
    if ( !bcrypt.compareSync( password, user.password ) ) {
        return res.status(400).json({ message: 'Correo o contraseña no válidos - Password' })
    }

    const { role, name, _id, verificado } = user;

    const token = signToken( _id, email );

    return res.status(200).json({
        token, //jwt
        user: {
            email, role, name, verificado
        }
    })


}
const actualizar = async (req, res) => {
    const { _id, email, password, codigo, verificado} = req.body;
    
    await mongooseConnect();
    
    try {
        // Buscar el usuario por email para verificar si existe
        const user = await User.findOne({ email });

        if (user) {
            // Configurar las propiedades que se deben actualizar
            const updateFields = {};
            if (email) updateFields.email = email;
            if (password) updateFields.password = password;
            if (codigo) updateFields.codigo = codigo;
            if (verificado) updateFields.verificado = verificado;
            // Realizar la actualización parcial del usuario
            const updatedUser = await User.findOneAndUpdate(
                { email },
                { $set: updateFields }, // Utilizamos $set para actualizar solo los campos necesarios
                { new: true } // Devolver el usuario actualizado
            );

            res.status(200).json(updatedUser);
        } else {
            return res.status(400).json({ message: 'Correo o contraseña no válidos - EMAIL' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};