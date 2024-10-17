const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const EmailTemplate = require('../models/EmailTemplate');

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => {
    try {
        const templates = await EmailTemplate.findAll();

        const plainTemplates = templates.map(template => template.get({ plain: true }));

        res.render('templates', {
            title: 'Templates',
            description: 'Browse all templates.',
            templates: plainTemplates
    });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).send('Server Error');
    }
});

router.get('/new', async (req, res) => {
    const templates = await EmailTemplate.findAll();

    const plainTemplates = templates.map(template => template.get({ plain: true }));

    try {
        res.render('templates_new', { 
            title: 'Create New Template',
            description: 'Create a new template here.',
            templates: plainTemplates
        });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).send('Server Error');
    }
});

router.post('/upload', upload.single('templateFile'), async (req, res) => {
    const { name, subject, body } = req.body;

    if (req.file) {
        const filePath = req.file.path;

        // Read the content of the uploaded .txt file
        fs.readFile(filePath, 'utf-8', async (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return res.status(500).send('Server Error');
            }

            const fileBody = data.trim();

            try {
                await EmailTemplate.create({ name, subject, body: fileBody });

                // Delete the file after processing
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });

                res.redirect('/templates');
            } catch (error) {
                console.error('Error saving template:', error);
                res.status(500).send('Server Error');
            }
        });
    } else if (body) {
        try {
            await EmailTemplate.create({ name, subject, body });

            res.redirect('/templates');
        } catch (error) {
            console.error('Error saving template:', error);
            res.status(500).send('Server Error');
        }
    } else {
        return res.status(400).send('You must either upload a file or enter the template body.');
    }
});

router.get('/edit/:id', async (req, res) => {
    const templateId = req.params.id;

    try {
        const template = await EmailTemplate.findByPk(templateId);

        if (!template) {
            return res.status(404).send('Template not found');
        }

        res.render('edit_template', {
            title: 'Edit Template',
            description: 'Update the template details below.',
            template: template.get({ plain: true }) // Pass plain object to avoid prototype access issues
        });
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).send('Server Error');
    }
});

router.post('/update/:id', async (req, res) => {
    const templateId = req.params.id;
    const { name, subject, body } = req.body;

    try {
        const template = await EmailTemplate.findByPk(templateId);

        if (!template) {
            return res.status(404).send('Template not found');
        }

        await template.update({ name, subject, body });

        res.redirect('/templates');
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).send('Server Error');
    }
});

router.post('/delete/:id', async (req, res) =>{
    const templateId = req.params.id;

    try{
        const template = await EmailTemplate.findByPk(templateId);

        if (!template) {
            return res.status(404).send('Template note found');
        }

        await template.destroy();

        res.redirect('/templates');
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).send('Server Error');
    }
});




// Test route
router.get('/test', (req, res) => {
    res.render('templates_test', {
        title: 'Test Template',
        description: 'Test a template here.',
    });
});

module.exports = router;
