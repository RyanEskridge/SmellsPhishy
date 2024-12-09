const Campaigns = require('./Campaigns');
const EmailTemplate = require('./EmailTemplate');
const Lists = require('./Lists');
const Targets = require('./Targets');
const TestTargets = require('./TestTargets');
const Tests = require('./Tests');
const GlobalSettings = require('./GlobalSettings');


// One-to-Many: Tests belong to Campaigns
Tests.belongsTo(Campaigns, { foreignKey: 'camp_id' });
Campaigns.hasMany(Tests, { foreignKey: 'camp_id' });

// Many-to-Many: Targets and Tests through TestTargets
Targets.belongsToMany(Tests, {
    through: TestTargets,
    foreignKey: 'targetId',
    otherKey: 'testId',
});

Tests.belongsToMany(Targets, {
    through: TestTargets,
    foreignKey: 'testId',
    otherKey: 'targetId',
});

// Direct Associations for Join Table
TestTargets.belongsTo(Tests, { foreignKey: 'testId' });
TestTargets.belongsTo(Targets, { foreignKey: 'targetId' }); 

Tests.belongsTo(EmailTemplate, { foreignKey: 'template_id' }); 
EmailTemplate.hasMany(Tests, { foreignKey: 'template_id' });


// Export all models
module.exports = {
    Campaigns,
    EmailTemplate,
    Lists,
    Targets,
    Tests,
    TestTargets,
    GlobalSettings,
};