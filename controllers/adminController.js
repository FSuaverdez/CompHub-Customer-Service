const Ticket = require('../models/Ticket')
const fs = require('fs')

const handleErrors = (err) => {
  console.log(err.message, err.code)

  let errors = {}

  if (err.message.includes('ticket validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
    console.log(errors)
  }

  return errors
}

module.exports.ticket_getAll = async (req, res) => {
  const user = res.locals.user
  const isOpen = req.params.status == 'open' ? true : false
  const isAll = req.params.status == 'all' ? true : false
  try {
    let tickets
    if (isAll) {
      tickets = await Ticket.find().sort({ createdAt: -1 })
    } else {
      tickets = await Ticket.find({ isOpen }).sort({ createdAt: -1 })
    }

    res.render('pages/admin/adminTicket', { tickets })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}
