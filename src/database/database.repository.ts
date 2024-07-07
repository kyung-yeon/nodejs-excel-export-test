import { Injectable } from "@nestjs/common";
import knex from 'knex';
import { postProcessResponse, wrapIdentifier } from './support';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseRepository {
    private readonly db;

    constructor(private readonly configService: ConfigService) {
        this.db = knex({
            client: 'mysql2',
            connection: {
                host: configService.get('MYSQL_HOST'),
                port: +configService.get('MYSQL_PORT'),
                user: configService.get('MYSQL_USER'),
                password: configService.get('MYSQL_PASSWORD'),
                database: configService.get('MYSQL_DATABASE'),
                dateStrings: true,
                namedPlaceholders: true,
            },
            pool: {
                min: 1,
                max: 10,
            },
            acquireConnectionTimeout: 1000 * 10,
            debug: false,
            postProcessResponse,
            wrapIdentifier,
        });
    }

    async getData() {
        const res = await this.db('user').select();

        console.log(res);

        return 'test';
    }
}