import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from 'bcryptjs';

export const checkUserEmailPassword = async( email, password ) => {
    
    await mongooseConnect();
    const user = await User.findOne({ email });
    
    

    if ( !user ) {
        return null;
    }

    if ( !bcrypt.compareSync( password, user.password ) ) {
        return null;
    }
    console.log(user)
    const { role, name, _id } = user;

    return {
        _id,
        email: email.toLocaleLowerCase(),
        role,
        name,
    }
}


// Esta función crea o verifica el usuario de OAuth
export const oAUthToDbUser = async( oAuthEmail, oAuthName ) => {

    await mongooseConnect();
    const user = await User.findOne({ email: oAuthEmail });

    if ( user ) {
        const { _id, name, email, role } = user;
        return { _id, name, email, role };
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client'  });
    await newUser.save();

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };

}
