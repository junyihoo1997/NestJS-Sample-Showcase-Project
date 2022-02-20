import { Logger } from '@nestjs/common';
import { EntityCaseNamingStrategy } from '@mikro-orm/core';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const envConfig = require('dotenv').config({
	path: `.env`,
});

function env(key) {
	return envConfig[key] || process.env[key];
}

function config(): MikroOrmModuleOptions {
	let sslCert = {};
	if(env('DATABASE_SSL_CERT')) {
		sslCert = {
			driverOptions: {
				connection: {
					ssl: {
						ca: Buffer.from(env('DATABASE_SSL_CERT'), 'base64').toString('utf-8')
					}
				}
			}
		};
	}

	return {
		type: 'mongo',
		clientUrl: env('DATABASE_CONNECTION'),
		dbName: env('DATABASE_DB'),
		entities: ['./dist/entities/**/*.js'],
		entitiesTs: ['./src/entities/**/*.ts'],
		debug: env('DATABASE_DEBUG') == 'true' ? ['query','query-params'] : false,
		forceUtcTimezone: true,
		logger: msg => {
			Logger.debug(msg, 'DB');
		},
		namingStrategy: EntityCaseNamingStrategy,
		metadataProvider: TsMorphMetadataProvider,
		...sslCert,
		pool: {
			min: 1,
			max: 25,
		},
		// useBatchInserts: false,
		// useBatchUpdates: false,
		replicas: !env('DATABASE_REPLICA') ? undefined : env('DATABASE_REPLICA').split(',').map((clientUrl: string, index: number) => {
			return {
				name: `replica-${index}`,
				clientUrl
			};
		}),
	};
}

export default config();