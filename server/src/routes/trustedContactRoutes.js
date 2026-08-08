import express from "express";

import {
  addTrustedContact,
  getTrustedContacts,
  deleteTrustedContact
} from "../controllers/trustedContactController.js";

const router = express.Router();


// Add trusted contact
router.post("/", addTrustedContact);


// Get user's trusted contacts
router.get("/user/:userId", getTrustedContacts);


// Delete trusted contact
router.delete("/:id", deleteTrustedContact);


export default router;