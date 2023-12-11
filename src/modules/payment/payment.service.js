const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { creatorService } = require('../creator');
// const { userService } = require('../user')
// const userService = require('../user/_user.service')
const User = require('../user/user.model')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCustomer = async (email) => {
  // const user = await User.findOne({ email });
  const user = await User.findOne({ email });
  let customer;
  if (user && user.customerId !== "") {
    customer = await stripe.customers.retrieve(user.customerId);
  } else {
    customer = await stripe.customers.create({
      email,
    })
    user.customerId = customer.id;
    await user.save();
  }
  return user;
}

const createCard = async (user, card) => {
  const { number, exp_month, exp_year, cvc } = card;
  const availableCards = await listAvailableCards(user.customerId);
  for (let c of availableCards) {
    if (c.last4 === number.slice(-4)) {
      throw new ApiError(httpStatus.CONFLICT, "You have already added this card")
    }
  }
  try {
    const cardToken = await stripe.tokens.create({
      card: {
        number,
        exp_month,
        exp_year,
        cvc,
      },
    })

    const createdCard = await stripe.customers.createSource(user.customerId, { source: cardToken.id })
    return createdCard;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Your card number is incorrect!")
  }
}

const createConnectAccount = async (email) => {
  const account = await stripe.accounts.create({
    type: 'express',
    email: email,
  })
  // console.log(account);
  return account;
}

const generateConnectAccountLink = async (creatorId) => {
  let accountId;
  const creator = await creatorService.findCreatorById(creatorId);
  // const account = await createSeller();
  if (creator.accountId !== "") {
    accountId = creator.accountId;
  } else {
    const account = await createConnectAccount(creator.email)
    creator.accountId = account.id;
    await creator.save();
    accountId = account.id;
  }
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: 'http://localhost:8000/v1/creator/connect_account/create/failed',
    return_url: 'http://localhost:3000/v1/creator/connect_account/create/success',
    type: 'account_onboarding',
  })
  return link
}

const listAvailableCards = async (customerId) => {
  if (customerId === "") {
    return [];
  }
  const limit = 10;
  let cards = await stripe.customers.listSources(
    customerId,
    { object: 'card' }
  )

  if (cards.has_more) {
    cards = await stripe.customers.listSources(
      customerId,
      limit + 10,
      { object: 'card' }
    )
  }
  return cards.data
}

module.exports = {
  createCustomer,
  createCard,
  generateConnectAccountLink,
  listAvailableCards
}

// const createSeller = async (email) => {
//   const account = await stripe.accounts.create({
//     type: 'express',
//     email: email,
//   })
//   // console.log(account);
//   return account;
// }

// const generateAccountLink = async (beauticianId) => {
//   let accountId;
//   const beautician = await beauticianService.getBeauticianById(beauticianId);
//   // const account = await createSeller();
//   if (beautician.accountId !== "") {
//     accountId = beautician.accountId;
//   } else {
//     const account = await createSeller(beautician.email)
//     beautician.accountId = account.id;
//     await beautician.save();
//     accountId = account.id;
//   }
//   const link = await stripe.accountLinks.create({
//     account: accountId,
//     refresh_url: 'http://localhost:3000/v1/beautician/connect_account/create/failed',
//     return_url: 'http://localhost:3000/v1/beautician/connect_account/create/success',
//     type: 'account_onboarding',
//   })
//   return link
// }
