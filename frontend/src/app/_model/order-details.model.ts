import { OrderProductQuantity } from "./order-quantity.model";

export interface OrderDetals{
    fullName: string;
    fullAddress: string;
    contactNumber: string;
    altNumber: string;
    transactionId: string;
    orderProductQuantityList: OrderProductQuantity[];
}