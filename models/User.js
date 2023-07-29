
import mongoose, {model, Schema, models} from "mongoose";

const UserSchema = new Schema({

    name    : { type: String, required: true },
    email   : { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: {
            values: ['admin','client'],
            message: '{VALUE} no es un role válido',
            default: 'client',
            required: true
        }
    },
    verificado: {type:Boolean, default:false},
    codigo:{type:String, default:''}
}, {
    timestamps: true,
})

export const User = models.User || model('User', UserSchema);