const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const clientControllers = require("../Controllers/Client-Controllers");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/clients", clientControllers.getAllClients);
router.get("/get/client/byid/:id", clientControllers.getClientById);

router.post(
  "/create/client",
  [
    check("clientName").isLength({ min: 2, max: 255 }),
    check("companyName").isLength({ min: 2, max: 255 }),
    check("projects").isLength({ min: 2 }),
    check("mobile").isLength({ min: 6, max: 12 }),
    check("email").isEmail(),
  ],
  clientControllers.createClient
);
router.patch(
  "/update/client/byid/:id",
  [
    check("clientName").isLength({ min: 2, max: 255 }),
    check("companyName").isLength({ min: 2, max: 255 }),
    check("projects").isLength({ min: 2 }),
    check("mobile").isLength({ min: 6, max: 12 }),
  ],
  clientControllers.updateClientById
);
router.delete("/delete/client/byid/:id", clientControllers.deleteClientById);

module.exports = router;
