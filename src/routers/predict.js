const express = require('express');
const router = express.Router();
const {
  Predict,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   Predict:
 *     properties:
 *       userId:
 *         type: string
 *       username:
 *         type: string
 *       avatar:
 *         type: string
 *       date:
 *         type: string
 *       predictResult:
 *         type: integer
 *       actualResult:
 *         type: integer
 *       predictValue:
 *         type: integer
 *       actualValue:
 *         type: integer
 *       isFinished:
 *         type: boolean
 */

/**
 * @swagger
 * definitions:
 *   Index:
 *     properties:
 *       price:
 *         type: string
 *       ratio:
 *         type: string
 *       proportion:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   PredictCreateDTO:
 *     properties:
 *       phoneNum:
 *         type: string
 *       predictResult:
 *         type: integer
 *       predictValue:
 *         type: integer
 */


/**
 * @swagger
 * /predict/list:
 *   get:
 *     tags:
 *       - Predicts
 *     description: Returns all predicts
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: current
 *         in: query
 *         type: integer
 *       - name: pageSize
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: An Object contains array of predicts
 *         schema:
 *           $ref: '#/definitions/Predict'
 */
router.get('/list', Predict.getAll);

/**
 * @swagger
 * /predict/latestIndex:
 *   get:
 *     tags:
 *       - Predicts
 *     description: Returns latest index
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Object contains latest index
 *         schema:
 *           $ref: '#/definitions/Index'
 */
router.get('/latestIndex', Predict.getLatestIndex);

/**
 * @swagger
 * /predict/personal:
 *   get:
 *     tags:
 *       - Predicts
 *     description: Returns one's predicts
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
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Object contains one's predicts
 *         schema:
 *           $ref: '#/definitions/Predict'
 */
router.get('/personal', Predict.getAllByUserId);


/**
 * @swagger
 * /predict/personalLatest:
 *   get:
 *     tags:
 *       - Predicts
 *     description: Returns one's latest predict
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Object contains one's latest predict
 *         schema:
 *           $ref: '#/definitions/Predict'
 */
router.get('/personalLatest', Predict.getLatestByUserId);

/**
 * @swagger
 * /predict/add:
 *   post:
 *     tags:
 *       - Predicts
 *     description: Creates a new predict
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: predict
 *         description: Predict object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/PredictCreateDTO'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/add', Predict.addOne);

module.exports = router;
