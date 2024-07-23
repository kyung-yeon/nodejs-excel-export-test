## nodejs 엑셀 내보내기 속도 테스트
모든 데이터를 메모리에 올리는 방식부터 stream 그리고 stream 에 transform 을 사용한 방식에 대해 속도 차이와 메모리 사용량 차이를 알아보기 위한 테스트 프로젝트 입니다.

## How to install
```
npm ci
```

## How to run
```
npm run start:dev
```

## Endpoint
1. http://localhost:3000/excel
   * 기본 다운로드를 제공합니다.
2. http://localhost:3000/stream
    * stream을 통한 다운로드를 제공합니다.
3. http://localhost:3000/transform
    * stream에 pipe를 사용해 데이터를 조작하며 속도를 개선합니다.

## ENV
.env
```
MYSQL_HOST="..."
MYSQL_PORT=...
MYSQL_USER="..."
MYSQL_PASSWORD="..."
MYSQL_DATABASE="excel-export"
```