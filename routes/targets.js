const express = require('express');
const router = express.Router();
const { Targets, Lists } = require('../models');
const csvProcessor = require('../helpers/csvProcessor');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded. Please try again.');
  }

  const csvFilePath = req.file.path;
  csvProcessor.processCsvFile(csvFilePath, (err) => {
    if (err) {
      console.error('Error processing CSV:', err);
      return res.status(500).send('Error processing CSV file. Please try again.');
    }
    res.redirect('/targets');
  });
});

router.get('/', async (req, res) => {
  try {
    const targets = await Targets.findAll();
    const plaintargets = targets.map(target => target.get({ plain: true }));
    res.render('targets', {
      targets: plaintargets,
      title: 'Targets',
      description: 'Create a new target or view all targets.',
      errorMessage: null,
    });
  } catch (error) {
    res.render('targets', {
      targets: [],
      title: 'targets',
      description: 'Create a new target or view all targets.',
      errorMessage: 'Unable to load target data. Please try again later.',
    });
  }
});

router.get('/lists', async (req, res) => {
  try {
    const lists = await Lists.findAll();
    const plainLists = lists.map(list => list.get({ plain: true }));
    res.render('lists', {
      lists: plainLists,
      title: 'Lists',
      description: 'Create a new list or view all existing lists.',
      errorMessage: null,
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.render('lists', {
      lists: [],
      title: 'Lists',
      description: 'Create a new list or view all existing lists.',
      errorMessage: 'Unable to load lists data. Please try again later.',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const target = await Targets.findByPk(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'target not found.' });
    }
    res.status(200).json(target);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load target data.' });
  }
});

router.post('/add', async (req, res) => {
  // console.log('New target data:', req.body);
  const { FirstName, LastName, EmailAddress, JobTitle, Supervisor, Department } = req.body;
  try {
    await Targets.create({
      FirstName: FirstName,
      LastName: LastName,
      EmailAddress: EmailAddress,
      JobTitle: JobTitle,
      Supervisor: Supervisor,
      Department: Department,
    });
    res.redirect('/targets');
  } catch (error) {
    console.error('Error inserting target:', error);
    res.status(500).send('Server error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Targets.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ message: 'target not found.' });
    }
    res.status(200).json({ message: 'target updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update target data.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Targets.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'target not found.' });
    }
    res.status(200).json({ message: 'target deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete target.' });
  }
});

router.post('/lists', async (req, res) => {
  const { ListName, ListDescription } = req.body;
  try {
    await Lists.create({
      ListName,
      ListDescription,
      ListTargets: [],
    });
    res.redirect('/targets/lists');
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).send('Failed to create a new list.');
  }
});

router.get('/lists/:id', async (req, res) => {
  try {
    const list = await Lists.findByPk(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found.' });
    }

    const plainList = list.get({ plain: true });
    const targets = await Targets.findAll();
    const plainTargets = targets.map(target => target.get({ plain: true }));

    const selectedTargets = new Set((plainList.ListTargets || []).map(id => id.toString()));
    const targetsWithSelection = plainTargets.map(target => ({
      ...target,
      isSelected: selectedTargets.has(target.id.toString()),
    }));    

    console.log(targetsWithSelection);
    res.render('list_details', {
      list: plainList,
      targets: targetsWithSelection,
      title: plainList.ListName,
      description: plainList.ListDescription,
      errorMessage: null,
    });
  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).send('Unable to load the list. Please try again later.');
  }
});

router.put('/lists/:id', async (req, res) => {
  const { selectedTargets } = req.body;
  try {
    const list = await Lists.findByPk(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found.' });
    }

    list.ListTargets = selectedTargets || [];
    await list.save();
    res.status(200).json({ message: 'List updated successfully.' });
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ message: 'Failed to update list targets.' });
  }
});

router.delete('/lists/:id', async (req, res) => {
  try {
    const deleted = await Lists.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'List not found.' });
    }
    res.status(200).json({ message: 'List deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete list.' });
  }
});

module.exports = router;