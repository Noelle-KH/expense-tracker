const router = require('express').Router()
const { recordValidator } = require('../../middleware/validator')
const recordController = require('../../controllers/record-controller')

router.get('/', recordController.getRecords)
router.get('/new', recordController.newRecord)
router.post('/', recordValidator, recordController.postRecord)
router.get('/:_id/edit', recordController.editRecord)
router.put('/:_id', recordValidator, recordController.putRecord)
router.delete('/:_id', recordController.deleteRecord)

module.exports = router
