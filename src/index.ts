import { Handler, APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from "uuid";

export const handler: Handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    console.log(`event: ${JSON.stringify(event)}`)
    console.log(`context: ${JSON.stringify(context)}`)
    const body = JSON.parse(event?.body || null)
    const greeting = body?.name ? body?.name : "lambda"
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        message: `Hello ${greeting}!`,
        id: uuidv4()
      })
    };
  } catch (error) {
    console.log(`error: ${error}`)
    return {
      statusCode: 500,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: `Internal Server Error` })
    };
  }
};
