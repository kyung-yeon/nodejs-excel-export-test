import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/apps/app.module';
import { DatabaseRepository } from 'src/apps/database/database.repository';
import { FIXTURE_NAMES } from './fixtures/name';
import { FIXTURE_ADDRESSES } from './fixtures/address';
import { FIXTURE_PROD_NAMES } from './fixtures/prod-name';
import { FIXTURE_COLORS } from './fixtures/color';
import { FIXTURE_SIZES } from './fixtures/size';
import { FIXTURE_OPTS } from './fixtures/opt';

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
    
    /**
     * 1. 2,000,000 사용자
     * 2. 10개 category
     * 3. 1,000개 상품
     * 4. 1,000개 상품 상세
     * 
     * 1. 500,000 주문 (4명중 1명 주문한 꼴)
     * 2. 한 주문당 1~5개 상품 랜덤 구매
     * 3. 주문 일자는 2024년 7/1 ~ 7/31 랜덤
     * 
     * 기대되는 엑셀 row 수: 50만건
     */
    const users = new Array(2_000_000).fill({}).map((data, idx) => {
        return {
            userId: idx + 1,
            name: FIXTURE_NAMES[getRandomNumber(0, 299)],
            age: getRandomNumber(10, 80),
            address: FIXTURE_ADDRESSES[getRandomNumber(0, 19)],
        }
    });
    // await repository.bulkInsert('user', users);

    const products = new Array(1_000).fill({}).map((data, idx) => {
        return {
            productId: idx + 1,
            categoryId: getRandomNumber(1, 10),
        }
    });
    // await repository.bulkInsert('product', products);

    const productDetails = new Array(1_000).fill({}).map((data, idx) => {
        return {
            productId: idx + 1,
            productDetailId: idx + 1,
            name: FIXTURE_PROD_NAMES[getRandomNumber(0, 999)],
            color: FIXTURE_COLORS[getRandomNumber(0, 9)],
            size: FIXTURE_SIZES[getRandomNumber(0, 9)],
            opt1: FIXTURE_OPTS[getRandomNumber(0, 19)],
            opt2: FIXTURE_OPTS[getRandomNumber(0, 19)],
            opt3: FIXTURE_OPTS[getRandomNumber(0, 19)],
            opt4: FIXTURE_OPTS[getRandomNumber(0, 19)],
            opt5: FIXTURE_OPTS[getRandomNumber(0, 19)],
            opt6: FIXTURE_OPTS[getRandomNumber(0, 19)],
            opt7: FIXTURE_OPTS[getRandomNumber(0, 19)],
            opt8: FIXTURE_OPTS[getRandomNumber(0, 19)],
            originPrice: getRandomNumber(100_000, 1_000_000),
            price: getRandomNumber(10_000, 100_000),
        }
    })
    // await repository.bulkInsert('productDetail', productDetails);

    const orders = [];
    const orderDetails = [];
    const payments = [];

    let ordersDetailId = 1;
    new Array(500_000).fill({}).forEach((data, idx) => {
        const date = '2024-07-' + getRandomNumber(1, 31).toString().padStart(2, '0') + ' 00:00:00';
        const o: any = {
            ordersId: idx + 1,
            userId: getRandomNumber(0, 1_999_999),
            createdAt: date,
            updatedAt: date,
        };
        const od = [];
        let originPrice = 0;        
        let price = 0;        

        // 한 주문당 1~5개 아이템을 주문한다고 가정
        for (let i=0; i<getRandomNumber(1, 5); i++) {
            const orderProduct = products[getRandomNumber(0, 999)];
            const orderProductDetail = productDetails[getRandomNumber(0, 999)];

            originPrice += orderProductDetail.originPrice;
            price += orderProductDetail.price;

            od.push({
                ordersDetailId: ordersDetailId,
                ordersId: idx + 1,
                productId: orderProduct.productId,
                originPrice: orderProductDetail.originPrice,
                price: orderProductDetail.price
            })
            ordersDetailId++;
        }
        
        o.originPrice = originPrice;
        o.price = price;

        orders.push(o);
        orderDetails.push(...od);
        payments.push({
            userId: o.userId,
            ordersId: o.ordersId,
            price: o.price,
        })
    })

    await repository.bulkInsert('orders', orders);
    await repository.bulkInsert('ordersDetail', orderDetails);
    await repository.bulkInsert('payment', payments);
})()
.catch((err) => {
    console.log('err -> ', err);
})
.finally(() => {
    process.exit(1);
});
