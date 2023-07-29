import  { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import { signToken } from '@/utils/token';
import { Order } from '@/models/Order';


export default function handler(req, res) {
    
    switch( req.method ) {
        case 'GET':
            return encontrarOrden(req, res)
        
        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

async function encontrarOrden(req, res){
    
    await mongooseConnect();
    const ordenes = await Order.find();

    return res.status(200).json({
        ordenes
    })
}