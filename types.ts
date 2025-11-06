export enum UserRole {
  Admin = 'A',
  Designer = 'B',
  Producer = 'C',
}

export interface OrderItem {
  id: string;
  size: string; // talle
  detail1: string; // extra detail 1 (e.g., nombre)
  detail2: string; // extra detail 2 (e.g., número)
  isDesignComplete: boolean;
  isProductionComplete: boolean;
}

export interface Order {
  id: string;
  name: string;
  client: string;
  details: string;
  items: OrderItem[];
  startDate: string | null; // fecha de ingreso
  designEndDate: string | null;
  productionEndDate: string | null;
  deliveryDate: string | null; // fecha de entrega
  assignedTo: string | null; // a quien será derivado
}

export interface Notification {
  id: string;
  message: string;
  orderId: string;
  timestamp: string; // ISO String
  isRead: boolean;
  targetRoles: UserRole[];
}
