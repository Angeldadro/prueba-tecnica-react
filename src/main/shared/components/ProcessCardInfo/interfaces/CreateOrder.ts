export interface IOrderItem {
    id: string;   
    itemId: string; 
    quantity: number;
}
  
export interface IAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string; 
    country: string; 
}
  
export interface IPaymentDetails {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardHolder: string;
}

export interface ICreateOrderPayload {
    id: string;                    
    items: IOrderItem[];          
    shippingAddress: IAddress;    
    paymentDetails: IPaymentDetails;
    acceptenceToken: string;
}
 
/* ejemplo para saber como mandarla */
// @ts-ignore
const orderData: ICreateOrderPayload = {
    id: "some-order-client-uuid",
    items: [
      { id: "item-order-uuid-1", itemId: "product-uuid-abc", quantity: 2 },
      { id: "item-order-uuid-2", itemId: "product-uuid-def", quantity: 1 }
    ],
    shippingAddress: {
      street: "456 Oak Avenue",
      city: "Anytown",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    paymentDetails: {
      cardHolder: 'Anthony Perez',
      cardNumber: "4242424242424242", 
      expiryMonth: "12",
      expiryYear: "2026",
      cvv: "456"
    }
  };
  