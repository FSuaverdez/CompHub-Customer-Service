const { Router } = require('express')

const { ticket_getAll } = require('../controllers/adminController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')

const router = Router()

router.get('/admin/tickets/:status', requireAuth, checkUser, ticket_getAll)

module.exports = router
