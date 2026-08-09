import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './index';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`=======================================================`);
  console.log(`  CrisisMind AI Emergency Operations Center API active  `);
  console.log(`  Port: ${port} | Env: ${process.env.NODE_ENV || 'development'}  `);
  console.log(`  Local Endpoint: http://localhost:${port}/api/incidents `);
  console.log(`=======================================================`);
});
