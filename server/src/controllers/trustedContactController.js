import TrustedContact from "../models/TrustedContact.js";
import User from "../models/User.js";


// ADD CONTACT
const addTrustedContact = async (req, res) => {
  try {
    const {
      userId,
      name,
      phone,
      relationship
    } = req.body;

    if (!userId || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "User, name and phone are required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const trustedContact = await TrustedContact.create({
      userId,
      name,
      phone,
      relationship
    });

    res.status(201).json({
      success: true,
      message: "Trusted contact added successfully",
      trustedContact
    });

  } catch (error) {
    console.error("Add contact error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to add trusted contact"
    });
  }
};


// GET CONTACTS
const getTrustedContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    const contacts = await TrustedContact.find({
      userId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      contacts
    });

  } catch (error) {
    console.error("Get contacts error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get trusted contacts"
    });
  }
};


// DELETE CONTACT
const deleteTrustedContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await TrustedContact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Trusted contact not found"
      });
    }

    res.json({
      success: true,
      message: "Trusted contact deleted successfully"
    });

  } catch (error) {
    console.error("Delete contact error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete trusted contact"
    });
  }
};


export {
  addTrustedContact,
  getTrustedContacts,
  deleteTrustedContact
};