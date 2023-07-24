const mongoose = require('mongoose');

const filesDownloadedSchema = new mongoose.Schema({
  fileURL: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('FilesDownloaded', filesDownloadedSchema);



// const Sequelize = require('sequelize');
// const sequelize = require('../ExpenseUtil/database');

// const filesDownloaded = sequelize.define('filesDownloaded', {
//     fileURL: Sequelize.TEXT,
// });

// module.exports = filesDownloaded;
