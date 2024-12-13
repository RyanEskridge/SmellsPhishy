const { Tests, TestTargets, GlobalSettings } = require('../models');

const handleClick = async (req, res) => {
  const { option, test, target } = req.params;
  const options = []
  const foundTarget = await TestTargets.findOne({
    where: {
      testId: test,
      targetId: target,
    }
  });

  if(!foundTarget) {
    res.status(500).json({ message: 'Failed to load.' });
  }

  if (!foundTarget.clicked) {
    foundTarget.clicked = true;
    await foundTarget.save();
  }

  let plainSettings;
  const defaultSettings = {
    id: 1,
    CompanyName: 'Mediocre Solutions',
    ApiKey: '6a53edf24a8d7698710adc470115b90',
    CustomLink: 'https://www.youtube.com/watch?v=o0btqyGWIQw'
  };
  
  try {
    const settings = await GlobalSettings.findByPk(1);
    if (!settings) { 
      plainSettings = defaultSettings; 
    } else {
      plainSettings = settings.get({ plain: true });
    }
  } catch (error) {
    console.error('Error fetching GlobalSettings:', error);
    plainSettings = defaultSettings;
  }

  switch (option) {
    case "0":
      res.render('click_default', {
        layout: 'click',
        title: 'Click',
        description: 'You did a bad thing.',
        path: `${foundTarget.targetId}`
      });
      break;
    case "1":
      res.redirect(plainSettings.CustomLink);
      break;
    case "2":
      res.status(404).send('Not Found');
      break;
    default:
      res.status(500).json({ message: 'Failed to load.' });
      break;
  }

};

module.exports = {
  handleClick
};
