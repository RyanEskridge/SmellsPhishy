const { Op } = require('sequelize');
const express = require('express');
const router = express.Router();
const { EmailTemplate, Targets, Lists, Tests, TestTargets, Campaigns } = require('../models')
const mailHandler = require('../helpers/mailHandler');
const { clerkClient } = require('@clerk/express');

router.post('/send-email', (req, res) => {
  mailHandler.sendMail(req, res);
});

router.get('/mail', async (req, res) => {
try {
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const tests = await Tests.findAll({ raw: true });
    const results = [];

    for (const test of tests) {
        const scheduledTime = new Date(test.scheduled_time).getTime();

        // Check if the test is within the last 24 hours
        if (currentTime - scheduledTime <= oneDay) {
            // Get the full EmailTemplate for this test
            const emailTemplate = await EmailTemplate.findOne({
                where: { id: test.template_id },
                raw: true,
            });
            // Get all target data associated with the test
            const targetAssociations = await TestTargets.findAll({
                where: { testId: test.id },
                raw: true,
            });

            const targetIds = targetAssociations.map((association) => association.targetId);
            const targets = await Targets.findAll({
                where: { id: targetIds },
                raw: true,
            });

            results.push({
                template: emailTemplate, 
                targets: targets,       
            });
        }
    }

    results.forEach((result) => {
        
        const templateSubject = result.template.subject;
        const templateBody = result.template.body;
        const from = "admin@mediocresolutions.org"
        
        result.targets.forEach((target) => {   
            const data = {
                "target.name": `${target.FirstName} ${target.LastName}`,
                company: "Mediocre Solutions",
                link: "https://example.com/reset-password"
            };

            const updatedBody = templateBody.replace(/{([^}]+)}/g, (_, key) => data[key] || `{${key}}`);
            
            console.log ("\n-------------------------------------------------------------------\n");
            console.log(`TO: ${target.EmailAddress}`);
            console.log(`FROM: ${from}`);
            console.log(`SUBJECT: ${templateSubject}`);
            console.log("BODY: \n");
            console.log(updatedBody);
            console.log ("\n-------------------------------------------------------------------\n");

            // console.log(`Job Title: ${target.JobTitle}`);
            // console.log(`Supervisor: ${target.Supervisor}`);
            // console.log(`Department: ${target.Department}`);
        });
    });

    res.json(results);
} catch (error) {
    console.error('Error fetching mail tests:', error);
    res.status(500).json({ message: 'Server error' });
}
});



module.exports = router;