import dbConnect from "@/util/mongo";
import User from "@/models/User";
import {Types} from 'mongoose'
import {hashSync} from 'bcrypt'
import {sign} from 'jsonwebtoken'

const secretKey = process.env.SECRET_JWT_KEY

const hashPassword = (plainPassword) => {
    return hashSync(plainPassword, 6)
}

const createToken = (payload) => {
    return sign(payload, secretKey)
}

export default async function handler (req, res) {
    try {
        await dbConnect()
        const {password, email} = req.body;
        const registeredUser = await User.findOne({email})
        const phone = new Types.ObjectId()
        if(registeredUser){
            res.status(404).json({
                text: 'Email already registered',
                code: 404
            })
        } else {
            const newPassword = await hashPassword(password)
            const registered = await new User({
                email,
                password: newPassword,
                phone
            })
            const user = await registered.save()
            if (user && registered) {
                const { email, role, _id, premium } = user
                const token = await createToken({ email, role, _id, premium })
                res.status(200).json({ data: { user, token }, text: "Register user successful", code: 200 })
            }
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e})
    }
}