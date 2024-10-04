const express = require('express');
const router = express.Router();
const clickHandler = require('../helpers/clickHandler');

router.get('/:clickId', (req, res) => {
    clickHandler.handleClick(req, res);
});
  
module.exports = router;