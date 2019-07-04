const express = require('express');
const router = express.Router();
const {
  Win,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   Win:
 *     properties:
 *       _id:
 *         type: string
 *       userId:
 *         type: string
 *       username:
 *         type: string
 *       avatar:
 *         type: string
 *       winTimes:
 *         type: integer
 *       predictTimes:
 *         type: integer
 *       winRatio:
 *         type: integer
 *       rank:
 *         type: integer
 */

/**
 * @swagger
 * /win/list:
 *   get:
 *     tags:
 *       - Predicts
 *     description: Returns all predicts
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Object contains array of predicts
 *         schema:
 *           $ref: '#/definitions/Win'
 */
router.get('/list', Win.getAll);

module.exports = router;
