import express from 'express';
import { init } from '@launchdarkly/node-server-sdk';

const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;

if (!sdkKey) {
  console.error(
    'LAUNCHDARKLY_SDK_KEY is not set. Copy .env.example to .env and fill it in.'
  );
  process.exit(1);
}

const ldClient = init(sdkKey);
const app = express();

app.get('/', async (req, res) => {
  const context = {
    kind: 'user',
    key: 'example-user-key'
  };

  const showNewGreeting = await ldClient.variation(
    'my-first-flag',
    context,
    false
  );

  res.json({
    greeting: showNewGreeting
      ? 'Hello from the new greeting!'
      : 'Hello, world.'
  });
});

const port = process.env.PORT || 3000;

try {
  await ldClient.waitForInitialization({ timeout: 5 });
  console.log('LaunchDarkly client initialized.');
} catch (err) {
  console.error(
    'LaunchDarkly failed to initialize; flags will serve defaults.',
    err
  );
}

const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      ldClient.close().then(() => process.exit(0));
    });
  });
}
