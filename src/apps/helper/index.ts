export const getExcelHeaders = (): {header:string, key:string, width:number}[] => {
  return [
    { header: '주문번호', key: 'orderId', width: 20 },
    { header: '주문자 이름', key: 'ordererName', width: 20 },
    { header: '주문자 나이', key: 'ordererAge', width: 20 },
    { header: '주문자 주소', key: 'ordererAddress', width: 20 },
    { header: '주문 총 원금액', key: 'orderOriginPrice', width: 20 },
    { header: '주문 총 할인금액', key: 'orderPrice', width: 20 },
    { header: '주문 개수', key: 'productCount', width: 20 },
    { header: '주문 총 결제 후 금액', key: 'paidPrice', width: 20 },
    { header: '상품명 나열', key: 'productNames', width: 20 },
    { header: '상품 카테고리 나열', key: 'productCategoryNames', width: 20 },
    { header: '상품 총 원금액 합계', key: 'productOriginPrice', width: 20 },
    { header: '상품 총 할인 후 금액 합계', key: 'productPrice', width: 20 },
    { header: '주문 일자', key: 'orderDate', width: 20 },
  ];
}