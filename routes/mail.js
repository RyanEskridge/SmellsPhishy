const express = require('express');
const router = express.Router();
const { EmailTemplate, Targets, Lists, Tests, TestTargets, Campaigns, GlobalSettings } = require('../models')
const { sendMail, massMailer } = require('../helpers/mailHandler');
const { clerkClient } = require('@clerk/express');

router.post('/send-email', (req, res) => {
  sendMail(req, res);
});

router.get('/mail', async (req, res) => {
try {
    const settings = await GlobalSettings.findByPk(1);
    const plainSettings = settings.get({ plain: true });
    
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const tests = await Tests.findAll({ raw: true, where: {status: true} });
    const results = [];

    for (const test of tests) {
        const scheduledTime = new Date(test.scheduled_time).getTime();
        
        // Check if the test is within the last 24 hours 
        if (true || currentTime - scheduledTime <= oneDay) {
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
                testId: test.id, 
                option: test.option  
            });
        }
    }
    
    results.forEach((result) => {
        const templateSubject = result.template.subject;
        const templateBody = result.template.body;
        const from = "admin@mediocresolutions.org"

        result.targets.forEach((target) => {   
            const local = "http://localhost:8080";
            const remote = "https://mediocresolutions.com";
            const compositeUrl = `${local}/click/${result.option}/${result.testId}/${target.id}`;
            const data = {
                "target.name": `${target.FirstName} ${target.LastName}`,
                "company.name": plainSettings.CompanyName,
                company: plainSettings.CompanyName,
                link: compositeUrl,
            };

            const updatedBody = templateBody.replace(/{([^}]+)}/g, (_, key) => data[key] || `{${key}}`);
            massMailer(from, target.EmailAddress, templateSubject, updatedBody, updatedBody);

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            
            delay(3000) 
            .then(() => {
                console.log("Waiting 3 seconds...");
            });
        });
    });

    res.json(results);
} catch (error) {
    console.error('Error fetching mail tests:', error);
    res.status(500).json({ message: 'Server error' });
}
});



module.exports = router;