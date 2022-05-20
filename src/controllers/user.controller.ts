import { Request, Response } from 'express'
import { getProfile } from '../models/user.models'

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
