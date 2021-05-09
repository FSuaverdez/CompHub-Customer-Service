const { Router } = require('express')

const {
  submit_get,
  submit_post,
  message_post,
  ticket_get,
  ticket_getAll,
} = require('../controllers/ticketController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = Router()

router.get('/support/submit', requireAuth, submit_get)
router.post('/support/submit', requireAuth, submit_post)
router.post('/support/postmessage', requireAuth, message_post)
router.get('/support/ticket/:id', requireAuth, ticket_get)
router.get('/support/status', requireAuth, ticket_getAll)

module.exports = router
