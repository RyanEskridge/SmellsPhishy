const Targets = require('./Targets');
const Tests = require('./Tests');
const TargetTests = require('./TargetTests');

// Defines many-to-many relationship between 'Tests' and 'Targets' through the
// join table 'TargetTests'
Targets.belongsToMany(Tests, { through: TargetTests }); 
Tests.belongsToMany(Targets, { through: TargetTests });

module.exports = { Targets, Tests, TargetTests };