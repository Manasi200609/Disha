import TrustedContact from "../models/TrustedContact.js";


// ============================================================
// GET CONTACTS
// ============================================================

const getTrustedContacts = async (
  req,
  res
) => {

  try {

    const contacts =
      await TrustedContact.find()
        .sort({ createdAt: -1 });


    return res.status(200).json({

      success: true,

      data: contacts

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Unable to load trusted contacts."

    });

  }

};


// ============================================================
// ADD CONTACT
// ============================================================

const addTrustedContact = async (
  req,
  res
) => {

  try {

    const {
      name,
      phone
    } = req.body || {};


    if (
      !name?.trim() ||
      !phone?.trim()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Name and phone number are required."

      });

    }


    const contact =
      await TrustedContact.create({

        name: name.trim(),

        phone: phone.trim()

      });


    return res.status(201).json({

      success: true,

      data: contact

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Unable to add trusted contact."

    });

  }

};


// ============================================================
// DELETE CONTACT
// ============================================================

const deleteTrustedContact = async (
  req,
  res
) => {

  try {

    const {
      id
    } = req.params;


    const contact =
      await TrustedContact.findByIdAndDelete(
        id
      );


    if (!contact) {

      return res.status(404).json({

        success: false,

        message:
          "Trusted contact not found."

      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Trusted contact deleted."

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Unable to delete trusted contact."

    });

  }

};


export {
  getTrustedContacts,
  addTrustedContact,
  deleteTrustedContact
};