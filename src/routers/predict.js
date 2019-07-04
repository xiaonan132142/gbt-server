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
 *       _id:
 *         type: string
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
 *     responses:
 *       200:
 *         description: An Object contains array of predicts
 *         schema:
 *           $ref: '#/definitions/Predict'
 */
router.get('/list', Predict.getAll);

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
