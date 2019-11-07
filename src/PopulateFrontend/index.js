const AWS = require('aws-sdk');
const { sendSuccess, sendFailure } = require('cfn-custom-resource');
const { execFile } = require('child_process');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const promisify = require('util').promisify;
const recursiveReaddir = require('recursive-readdir');
const writeFilePromise = promisify(fs.writeFile);

const s3 = new AWS.S3();
const tmpDir = `/tmp/react-front-end${process.pid}`;
const npm = 'npm';

exports.handler = async event => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));

  try {
    await setup();
    await uploadContent();
    console.log('POPULATE FRONTEND SUCCESS');
    await sendSuccess('PopulateFrontend', {}, event);
  } catch (err) {
    console.error('POPULATE FRONTEND FAILURE');
    console.error(err);
    await sendFailure(err.message, event);
    throw err;
  }

  function spawnPromise (command, args, options) {
    console.log(`Running \`${command} '${args.join("' '")}'\`...`);

    options = options || {};

    if (!options.env) {
      options.env = {};
    }

    Object.assign(options.env, process.env);

    return new Promise((resolve, reject) => {
      execFile(command, args, options, (err, stdout, stderr) => {
        console.log('STDOUT:');
        console.log(stdout);
        console.log('STDERR:');
        console.log(stderr);

        if (err) {
          err.stdout = stdout;
          err.stderr = stderr;

          reject(err);
        } else {
          resolve({ stdout: stdout, stderr: stderr });
        }
      });
    });
  }

  async function setup () {
    const configFileContents = `export default {
      apiEndpoint: '${process.env.API_URL}',
      accessKeyId: '${process.env.ACCESS_KEY_ID}',
      secret: '${process.env.SECRET}',
      region: '${process.env.AWS_REGION}',
      originalBucket: '${process.env.ORIGINAL_FILES_BUCKET_NAME}'
    };`;

    // Clear out tmp just in case
    await spawnPromise('rm', ['-rf', tmpDir]);
    // Copy frontend-content to /tmp
    await spawnPromise('cp', ['-R', 'frontend-code/', tmpDir]);
    // Write config file that contains environment variables
    await writeFilePromise(`${tmpDir}/src/config.js`, configFileContents);
    // npm install
    await spawnPromise(
      npm,
      ['--production',
        '--no-progress',
        '--loglevel=error',
        '--cache', path.join('/tmp', 'npm'),
        '--userconfig', path.join('/tmp', 'npmrc'),
        'install'
      ],
      { cwd: tmpDir }
    );
    console.log('NPM INSTALL SUCCESS');
    // npm build
    await spawnPromise(
      npm,
      ['--production',
        '--no-progress',
        '--loglevel=error',
        '--cache', path.join('/tmp', 'npm'),
        '--userconfig', path.join('/tmp', 'npmrc'),
        'run', 'build'
      ],
      { cwd: tmpDir }
    );
    console.log('NPM RUN BUILD SUCCESS');
  }

  async function uploadContent () {
    const files = await recursiveReaddir(`${tmpDir}/build`);

    const promises = files.map(file => s3.putObject({
      Bucket: process.env.FRONTEND_BUCKET_NAME,
      Key: path.relative(`${tmpDir}/build`, file),
      Body: fs.createReadStream(file),
      ContentType: mime.lookup(file) || 'application/octet-stream',
      ACL: 'public-read'
    }).promise());

    await Promise.all(promises);
  }
};
