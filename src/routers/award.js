const express = require('express');
const router = express.Router();
const {
  Award,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   Award:
 *     properties:
 *       userId:
 *         type: string
 *       username:
 *         type: string
 *       avatar:
 *         type: string
 *       accountName:
 *         type: string
 *       date:
 *         type: string
 *       result:
 *         type: integer
 */


/**
 * @swagger
 * /award/personal:
 *   get:
 *     tags:
 *       - Awards
 *     description: Returns one awards list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: An Object contains array of awards
 *         schema:
 *           $ref: '#/definitions/Award'
 */
router.get('/personal', Award.getOneByUserId);

module.exports = router;
