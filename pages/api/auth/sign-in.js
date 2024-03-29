import User from "@/models/User";
import dbConnect from "@/util/mongo";
import {compareSync} from 'bcrypt'
import { SignJWT } from "jose";

const secretKey = process.env.SECRET_JWT_KEY

const comparePassword = (plainPassword, hashedPassword) => {
    return compareSync(plainPassword, hashedPassword)
}

const createToken = (payload) => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 300; // five hour

    return new SignJWT({...payload})
        .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secretKey));
}

export default async function handler (req, res) {
    try {

        await dbConnect()

        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (user) {
            const comparedPassword = await comparePassword(password, user.password)
            if (comparedPassword) {
                const { phone, role, _id, email, premium } = user
                const token = await createToken({ phone, role, _id, email, premium: premium || false })
                if (token) {
                    res.status(200).json({
                        text: "Login successfull",
                        code: 200,
                        data: {
                            user,
                            token
                        }
                    })
                } else {
                    res.status(404).json({
                        text: "Not authrorized",
                        code: 404
                    })
                }
            } else {
                res.status(401).json({ text: "Wrong password", code: 401 })
            }
        } else {
            res.status(401).json({ text: "Email not registered", code: 401 })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            code: 500,
            error: e,
            text: 'internal server error'
        })
    }
}