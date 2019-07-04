const express = require('express');
const router = express.Router();
const {
  Active,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   Active:
 *     properties:
 *       _id:
 *         type: string
 *       userId:
 *         type: string
 *       username:
 *         type: string
 *       avatar:
 *         type: string
 *       times:
 *         type: integer
 *       rank:
 *         type: integer
 */

/**
 * @swagger
 * /active/list:
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
 *           $ref: '#/definitions/Active'
 */
router.get('/active/list', Active.getAll);

module.exports = router;
