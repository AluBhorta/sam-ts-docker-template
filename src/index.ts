import { Handler } from 'aws-lambda';

export const handler: Handler = async (event, context) => {
  console.log(`event: ${JSON.stringify(event)}`)
  console.log(`context: ${JSON.stringify(context)}`)
  const greeting = event?.name ? event.name : "World"
  return {
    statusCode: 200,
    body: `Hello ${greeting}!`
  };
};
