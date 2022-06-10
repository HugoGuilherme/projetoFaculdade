
const express = require('express')
const router = express.Router()
//helpers
const checkAuth = require('../helpers/auth').checkAuth
const BackupController = require('../controllers/BackupController')

router.get('/dashboard/backup', checkAuth, BackupController.paginaBackup)
router.get('/dashboard/backupSalvo', checkAuth, BackupController.criarBackup)

module.exports = router