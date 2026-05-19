const _ = require('lodash');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const minimist = require('minimist');
const moment = require('moment');
const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');
const debug = require('debug')('app');
require('dotenv').config();

const args = minimist(process.argv.slice(2));

function generateReport(data) {
  const id = uuidv4();
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const grouped = _.groupBy(data, 'category');

  return {
    id,
    timestamp,
    summary: _.mapValues(grouped, (items) => items.length),
    total: data.length
  };
}

async function fetchData(url) {
  const token = jwt.sign({ sub: 'demo-user' }, 'demo-secret', { expiresIn: '1h' });
  debug('Fetching data from %s', url);

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}

async function main() {
  const port = args.port || process.env.PORT || 3000;
  console.log(chalk.green(`Starting demo app on port ${port}`));
  console.log(chalk.blue(`Generated at: ${moment().format()}`));

  const sampleData = [
    { name: 'item-1', category: 'A' },
    { name: 'item-2', category: 'B' },
    { name: 'item-3', category: 'A' },
    { name: 'item-4', category: 'C' }
  ];

  const report = generateReport(sampleData);
  console.log('Report:', JSON.stringify(report, null, 2));
}

main().catch(console.error);
