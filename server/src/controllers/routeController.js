import {
  geocodeDestination,
  getCandidateRoutes
} from "../services/googleMapsService.js";


// ============================================================
// FIND ROUTES
// ============================================================

const findRoutes = async (req, res) => {

  try {

    const {
      currentLocation,
      destination
    } = req.body || {};


    // --------------------------------------------------------
    // Validate current location
    // --------------------------------------------------------

    if (
      !currentLocation ||
      typeof currentLocation.latitude !== "number" ||
      typeof currentLocation.longitude !== "number"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Valid current location is required."

      });

    }


    // --------------------------------------------------------
    // Validate destination
    // --------------------------------------------------------

    if (
      typeof destination !== "string" ||
      !destination.trim()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Destination is required."

      });

    }


    console.log(
      "🗺️ Route search:",
      destination
    );


    // --------------------------------------------------------
    // DESTINATION → COORDINATES
    // --------------------------------------------------------

    const destinationLocation =
      await geocodeDestination(
        destination
      );


    // --------------------------------------------------------
    // CURRENT LOCATION → DESTINATION
    // --------------------------------------------------------

    const routes =
      await getCandidateRoutes({

        start:
          currentLocation,

        destination:
          destinationLocation

      });


    if (!routes.length) {

      return res.status(404).json({

        success: false,

        message:
          "No routes found."

      });

    }


    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({

      success: true,

      data: {

        destination:
          destinationLocation,

        routes

      }

    });

  } catch (error) {

    console.error(
      "❌ Route search error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Unable to find routes."

    });

  }

};


export {
  findRoutes
};