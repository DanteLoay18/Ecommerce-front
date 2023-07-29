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
            return buscarComentarios(req, res)
        case 'PUT':
            return AgregarComentario(req, res)
        
        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }


}

async function buscarComentarios(req, res){
    const { id } = req.query;
    console.log(req.query)
    try {
      await mongooseConnect();
      const product = await Product.findOne({ _id: id });

      if (product) {
        res.status(200).json({ comments: product.comments || [] });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error del servidor' });
    }
} 



async function AgregarComentario(req, res){
    const {_id,comments} = req.body;

    const product= await Product.findById({_id});
    console.log(product)
    
    if(product){
        const productInfo = product.toObject();
        let nuevoRating= 0;
        if(productInfo.rated!==0){
            nuevoRating= (productInfo.rated+comments[0].rating)/2;
        }else{
            nuevoRating= comments[0].rating;
        }
        
        const resp=await Product.updateOne({ _id }, {...productInfo,rated:nuevoRating, comments:[...productInfo.comments, ...comments]});
        res.status(200).json({
            message: 'Se agrego el comentario'
        })
    }else{
        res.status(400).json({
            message: 'No existe el producto'
        })
    }
}