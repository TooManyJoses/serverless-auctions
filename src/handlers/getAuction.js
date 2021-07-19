import AWS from 'aws-sdk';
import middyMiddleware from '../common/middyMiddleware';
import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();


async function getAuction(event, context) {
  let auction;
  const { id } = event.pathParameters;

  try {
    const result = await dynamoDB.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }).promise();

    auction = result.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with id "${id}" not found.`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middyMiddleware(getAuction);
