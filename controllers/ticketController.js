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

module.exports.submit_get = (req, res) => {
  res.render('pages/submit-ticket')
}

module.exports.submit_post = async (req, res) => {
  const { requestType, subject, userId, body } = req.body
  const user = res.locals.user
  try {
    const { subject, requestType, userId } = req.body
    const ticket = await Ticket.create({
      senderName: `${user.firstName} ${user.lastName}`,
      subject,
      requestType,
      userId,
      body,
    })

    const image = req.files?.file
    if (image) {
      fs.writeFileSync(__dirname + '/../uploads/' + image.name, image.data)
    }

    if (image) {
      ticket.files.push({
        fileName: image.name,
      })

      await ticket.save()
    }

    res.status(201).json({ ticket: ticket._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}
module.exports.ticket_get = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)

    res.render('pages/ticket', { ticket })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.ticket_getAll = async (req, res) => {
  const user = res.locals.user
  try {
    const tickets = await Ticket.find({ userId: user._id })

    res.render('pages/service-status', { tickets })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.message_post = async (req, res) => {
  const user = res.locals.user
  const { body } = req.body
  try {
    const ticket = await Ticket.findById(req.params.id)

    ticket.messages.push({
      senderName: `${user.firstName} ${user.lastName}`,
      senderId: user._id,
      body,
    })

    await ticket.save()
    res.redirect(req.originalUrl)
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}
