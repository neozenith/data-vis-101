'use strict';

export { default as DockerReady } from './docker-ready';

/**
 * Below are the Strategies for testing if a service is ready for accepting commands
 * Each must export a single function of the form:
 *  (url:string): Promise<boolean>
 *
 * See DockerReady.learn for usage
 */

export { default as isAmqpReady } from './docker-ready-amqp';
export { default as isMongoReady } from './docker-ready-mongo';
export { default as isRedisReady } from './docker-ready-redis';
