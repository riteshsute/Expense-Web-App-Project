const Sequelize = require('sequelize');
const sequelize = require('../ExpenseUtil/database');

const filesDownloaded = sequelize.define('filesDownloaded', {
    fileURL: Sequelize.TEXT,
});

module.exports = filesDownloaded;
