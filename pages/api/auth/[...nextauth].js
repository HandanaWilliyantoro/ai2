import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
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
    const exp = iat + 60* 300; // five hour
    return new SignJWT({...payload})
        .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
        .setExpirationTime(exp)
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
  CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: "email", type: "text", placeholder: "jsmith" },
      password: { label: "password", type: "password" }
    },
    async authorize(credentials, req) {
      if (credentials) {
        return credentials
      }
      return null
    }
  })
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