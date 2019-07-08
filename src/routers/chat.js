const express = require('express');
const router = express.Router();
const {
  Chat,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   Chat:
 *     properties:
 *       _id:
 *         type: string
 *       userId:
 *         type: string
 *       username:
 *         type: string
 *       avatar:
 *         type: string
 *       createdAt:
 *         type: string
 *       content:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   ChatCreateDTO:
 *     properties:
 *       phoneNum:
 *         type: string
 *       content:
 *         type: string
 */


/**
 * @swagger
 * /chat/list:
 *   get:
 *     tags:
 *       - Chats
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
 *           $ref: '#/definitions/Chat'
 */
router.get('/list', Chat.getAll);

/**
 * @swagger
 * /chat/add:
 *   post:
 *     tags:
 *       - Chats
 *     description: Creates a new predict
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: predict
 *         description: Predict object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ChatCreateDTO'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/add', Chat.addOne);

module.exports = router;
