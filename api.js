'use strict';

/**
 * arduino() API Endpoint for accepting Arduino sensor data
 *
 * @param {object} req - request object
 * @param {object} res - response object
 *
 * @return {HTTPStatusCode} Returns 200 HTTP status code for valid data
 */
function arduino(req, res) {
	console.debug(req.body);
	res.sendStatus(200);
}

module.exports = { arduino };
