const handleClick = (req, res) => {
  // Get clickId

  const { clickId } = req.params;
  const isValid = /^[A-Za-z0-9]{6}$/.test(clickId);

  // Validate clickId

  if (req.path === '/click' || !isValid) {
    return res.status(404).send('Not Found');
  }

  const simulatedUsers = [
    {
      id: 'asd24x',
      behavior: null
    },
    {
      id: 'asd24y',
      behavior: 'redirect',
      redirectUrl: 'https://www.youtube.com/watch?v=o0btqyGWIQw'
    },
    {
      id: 'asd24z',
      behavior: 'error',
      errorCode: 404,
      errorMsg: 'Not found'
    }
  ];

  const match = simulatedUsers.find((user) => user.id === clickId);
  const behavior = match.behavior ? match.behavior : null;
  const errCode = match.errorCode ? match.errorCode : 404;
  const errMsg = match.errorMsg ? match.errorMsg : 'Not Found';
  const redirectUrl = match.redirectUrl ? match.redirectUrl : null;

  // Click handling switch

  switch (behavior) {
    case 'redirect':
      res.redirect(redirectUrl);
      break;
    case 'error':
      res.status(errCode).send(errMsg);
      break;
    default:
      res.render('click_default', {
        layout: 'click',
        title: 'Click',
        description: 'You did a bad thing.',
        path: `${clickId}`
      });
  }
};

module.exports = {
  handleClick
};
