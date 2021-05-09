const { Router } = require('express')
const { requireAuth } = require('../middleware/authMiddleware')

const router = Router()

router.get('/faq', (req, res) => {
  res.render('pages/faqs')
})

router.get('/support', requireAuth, (req, res) => res.render('pages/support'))

module.exports = router
