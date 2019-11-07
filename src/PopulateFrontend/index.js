const AWS = require('aws-sdk');
const { sendSuccess, sendFailure } = require('cfn-custom-resource');

exports.handler = async event => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));

  try {
    console.log(`AWS REGION: ${process.env.AWS_REGION}`);
    console.log(`ACCESS KEY ID: ${process.env.ACCESS_KEY_ID}`);
    console.log(`SECRET: ${process.env.SECRET}`);
    console.log(`API ENDPOINT: ${process.env.API_URL}`);
    console.log(`ORIGINAL FILES BUCKET: ${process.env.ORIGINAL_FILES_BUCKET_NAME}`);
    // TODO: Update this later to point to serverlessing.tech
    console.log(`FRONTEND BUCKET: ${process.env.FRONTEND_BUCKET_NAME}`);
    await sendSuccess('PopulateFrontend', {}, event);
  } catch (err) {
    await sendFailure(err.message, event);
    throw err;
  }
};
