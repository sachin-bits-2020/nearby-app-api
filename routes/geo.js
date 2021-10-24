/** @format */

const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");

const validate = [
  check("limit").isNumeric().withMessage("Please provide a valid"),
  check("offset").isNumeric().withMessage("Please provide a valid offset"),
  check("lat").isDecimal().withMessage("Please provide a valid latitude"),
  check("lng").isDecimal().withMessage("Please provide a valid longitude"),
  check("radius").isNumeric().withMessage("Please provide a valid radius"),
];

router.get("/nearby-users", validate, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // const users = await User.find({
    //   location: {
    //     $near: {
    //       $geometry: {
    //         type: "Point",
    //         coordinates: [req.query.lng, req.query.lat],
    //       },
    //       $maxDistance: req.query.radius,
    //       $minDistance: 0,
    //     },
    //   },
    // })
    const users = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
          },
          distanceField: "distanceFromUser",
          maxDistance: parseInt(req.query.radius),
          spherical: true,
          distanceMultiplier: 0.001,
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          location: 1,
          distanceFromUser: 1,
        },
      },
    ])
      .skip(req.query.offset * req.query.limit)
      .limit(parseInt(req.query.limit));

    res.send({
      users: users,
      success: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
