const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const { getUserByEmail } = require("../user/_user.service");
const News = require("./newsletter.model");




const createSubscription = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const news = await News.create({ userId: user.id });
  return news;
};

const fetchNewsLetterSubscriptions = async () => {
  const subscriptions = await News.find().populate('userId');
  return subscriptions;
}


const deleteNewslettersByIds = async (newsletterIds) => {
  // Use $in operator to delete multiple entries by their IDs
  const result = await News.deleteMany({ _id: { $in: newsletterIds } });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Newsletter subscriptions not found');
  }
};



module.exports = {
  createSubscription,
  fetchNewsLetterSubscriptions,
  deleteNewslettersByIds
};
