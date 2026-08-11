import express from "express";

import {
  getTrustedContacts,
  addTrustedContact,
  deleteTrustedContact
} from "../controllers/trustedContactController.js";


const router = express.Router();


router.get(
  "/",
  getTrustedContacts
);


router.post(
  "/",
  addTrustedContact
);


router.delete(
  "/:id",
  deleteTrustedContact
);


export default router;