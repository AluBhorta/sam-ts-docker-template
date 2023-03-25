import { Handler, APIGatewayEvent, Context } from 'aws-lambda';

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  console.log(`event: ${JSON.stringify(event)}`)
  console.log(`context: ${JSON.stringify(context)}`)
  const body = JSON.parse(event.body)
  const greeting = body?.name ? body?.name : "World"
  return {
    statusCode: 200,
    body: `Hello ${greeting}!`
  };
};
