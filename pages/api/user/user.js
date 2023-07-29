import  { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import { signToken } from '@/utils/token';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';


export default function handler(req, res) {

    switch( req.method ) {
        case 'GET':
            return buscarUsuarios(req, res)
       
        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }


}

async function buscarUsuarios(req, res){
    const resp=await User.find();
    res.status(200).json({
       ...resp
    })
}