import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware"
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/ContactController"

export const contactsRoutes = Router()

contactsRoutes.post("/search", verifyToken, searchContacts)
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList)
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts)