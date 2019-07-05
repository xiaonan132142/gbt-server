const express = require('express');
const router = express.Router();
const {
  Rank,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   Rank:
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
 *       winRank:
 *         type: integer
 *       predictRank:
 *         type: integer
 */

/**
 * @swagger
 * /rank/activeList:
 *   get:
 *     tags:
 *       - Ranks
 *     description: Returns all rank by active
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Object contains all rank by active
 *         schema:
 *           $ref: '#/definitions/Rank'
 */
router.get('/activeList', Rank.getAllByActive);

/**
 * @swagger
 * /rank/winList:
 *   get:
 *     tags:
 *       - Ranks
 *     description: Returns all rank by win
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Object contains all rank by win
 *         schema:
 *           $ref: '#/definitions/Rank'
 */
router.get('/winList', Rank.getAllByWin);

/**
 * @swagger
 * /rank/personal:
 *   get:
 *     tags:
 *       - Ranks
 *     description: Returns one statistics
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Object contains one statistics
 *         schema:
 *           $ref: '#/definitions/Rank'
 */
router.get('/personal', Rank.getOneByUserId);

module.exports = router;
