'use strict';
import { configure, getLogger } from 'log4js';
const configFile = `log4js.json`;
configure(configFile);

export { getLogger };
