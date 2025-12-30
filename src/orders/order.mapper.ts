import { Order } from './entities/order.entity';
import { parseMaybeJson } from 'src/utils/parse.json';

export class OrderMapper {
  static toResponse(order: Order) {
    return {
      order: {
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        customerName: order.customerName,
        email: order.email,
        assignedTo: order.assignedTo,
        orderId: order.id,
      },
      customFields: parseMaybeJson(order.customFields),
      address: order.address
        ? {
            buildingType: order.address.buildingType,
            houseNumber: order.address.houseNumber,
            apartmentNumber: order.address.apartmentNumber,
            street: order.address.street,
            city: order.address.city,
            zipCode: order.address.zipCode,
            state: order.address.state,
          }
        : null,
    };
  }
}
