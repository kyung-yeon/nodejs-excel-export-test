import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DatabaseRepository } from 'src/database/database.repository';

/**
 * ts-node -r tsconfig-paths/register src/script/make-dummy
 */

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {
    const app = await NestFactory.createApplicationContext({ module: AppModule });
    const configService = app.get(ConfigService);
    const repository = app.get(DatabaseRepository);

    // await repository.getData();

    // 주문 데이터를 만든다

})().finally(() => {
    process.exit(1);
});
