import { Request, Response } from 'express'
import { createUser, getProfile } from '../models/user.models'

export const addUser = async (req: Request, res: Response) => {
  try {
    const newUser = await createUser(req.params.sub)
    res.status(201)
    res.json(newUser)
  } catch (err) {
    console.error(err)
    res.sendStatus(404)
  }
}

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userProfile = await getProfile(req.params.sub)
    res.status(200)
    res.json(userProfile)
  } catch (err) {
    console.error(err)
    res.sendStatus(404)
  }
    
}