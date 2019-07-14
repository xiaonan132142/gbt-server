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
 *       id:
 *         type: string
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
 *       hasRead:
 *         type: boolean
 */

/**
 * @swagger
 * definitions:
 *   AwardUpdateDTO:
 *     properties:
 *       id:
 *         type: string
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
 *       - name: current
 *         in: query
 *         type: integer
 *       - name: pageSize
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: An Object contains array of awards
 *         schema:
 *           $ref: '#/definitions/Award'
 */
router.get('/personal', Award.getAllByUserId);


/**
 * @swagger
 * /award/personalLatest:
 *   get:
 *     tags:
 *       - Awards
 *     description: Returns one latest award
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: One's latest award
 *         schema:
 *           $ref: '#/definitions/Award'
 */
router.get('/personalLatest', Award.getLatestByUserId);


/**
 * @swagger
 * /award/update:
 *   post:
 *     tags:
 *       - Awards
 *     description: Update a award as hasRead
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Award id
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/AwardUpdateDTO'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.post('/update', Award.updateOne);

module.exports = router;
