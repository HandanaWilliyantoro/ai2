import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/util/mongo';
import User from '@/models/User';
import {Types} from 'mongoose'
import {hashSync} from 'bcrypt'
import {SignJWT} from 'jose';

const secretKey = process.env.SECRET_JWT_KEY

const hashPassword = (plainPassword) => {
    return hashSync(plainPassword, 6)
}

const createToken = (payload) => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60* 60; // one hour

    return new SignJWT({...payload})
        .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secretKey));
}

export const authOptions = {
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_AUTH_ID,
   clientSecret: process.env.GOOGLE_AUTH_SECRET,
  }),
 ],
 secret: secretKey,
 session: {
  strategy: 'jwt',
 },
 callbacks: {
    async signIn({ user }) {
        try {
            await dbConnect()

            if(user.email){
                const checkUser = await User.findOne({email: user.email})
        
                if(!checkUser){
                    const phone = new Types.ObjectId()
                    const newPassword = hashPassword('google')
                    const registered = await new User({
                        email: user.email,
                        password: newPassword,
                        phone
                    })
                    await registered.save()
                }
            }
            return true
        } catch(e) {
            return false
        }
    },
    async session({ session, token, user }) {
        session.accessToken = token.accessToken;
        return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
        const auth_token = await createToken({email: token.email})
        token.accessToken = auth_token;
        return token;
    },
 }
};

export default NextAuth(authOptions);