import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import CreateOrderModal from './components/CreateOrderModal';
import { UserRole, Order, Notification } from './types';

// Mock data for initial state
const initialOrders: Order[] = [
  {
    id: '1',
    name: 'Pedido Verano 2024 - Equipo A',
    client: 'Club Atlético Central',
    details: 'Camisetas titulares para el primer equipo. Logo grande en el pecho.',
    items: [
      { id: '1-1', size: 'M', detail1: 'Gomez', detail2: '10', isDesignComplete: true, isProductionComplete: true },
      { id: '1-2', size: 'L', detail1: 'Perez', detail2: '9', isDesignComplete: true, isProductionComplete: false },
      { id: '1-3', size: 'L', detail1: 'Rojas', detail2: '5', isDesignComplete: false, isProductionComplete: false },
    ],
    startDate: '2024-07-01',
    designEndDate: '2024-07-10',
    productionEndDate: null,
    deliveryDate: null,
    assignedTo: null,
  },
  {
    id: '2',
    name: 'Indumentaria Invierno - Staff',
    client: 'Gimnasio PowerFit',
    details: 'Buzos con capucha y logo bordado.',
    items: [
      { id: '2-1', size: 'S', detail1: 'Ana', detail2: 'Coach', isDesignComplete: true, isProductionComplete: true },
      { id: '2-2', size: 'M', detail1: 'Juan', detail2: 'Coach', isDesignComplete: true, isProductionComplete: true },
    ],
    startDate: '2024-06-20',
    designEndDate: '2024-06-25',
    productionEndDate: '2024-07-05',
    deliveryDate: '2024-07-08',
    assignedTo: 'Recepción Central',
  },
];


const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.Admin);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, orderId: string, targetRoles: UserRole[]) => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      message,
      orderId,
      targetRoles,
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  }

  const markAllAsRead = () => {
    setNotifications(prev => {
        const userNotificationsIds = prev
            .filter(n => n.targetRoles.includes(currentUserRole))
            .map(n => n.id);
        return prev.map(n => userNotificationsIds.includes(n.id) ? { ...n, isRead: true } : n);
    });
  }

  const addOrder = (newOrderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: crypto.randomUUID(),
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    addNotification(`Nuevo pedido '${newOrder.name}' ha sido creado.`, newOrder.id, [UserRole.Designer, UserRole.Producer]);
  };
  
  const updateOrder = (updatedOrder: Order) => {
    const originalOrder = orders.find(o => o.id === updatedOrder.id);
    if (!originalOrder) return;
    
    // Check for status changes to trigger notifications
    const allItems = (order: Order) => order.items.length > 0;
    const allDesigned = (order: Order) => allItems(order) && order.items.every(i => i.isDesignComplete);
    const allProduced = (order: Order) => allItems(order) && order.items.every(i => i.isProductionComplete);
    
    if (!allDesigned(originalOrder) && allDesigned(updatedOrder)) {
      addNotification(`El diseño para el pedido '${updatedOrder.name}' está completo.`, updatedOrder.id, [UserRole.Producer]);
    }
    
    if (!allProduced(originalOrder) && allProduced(updatedOrder)) {
      addNotification(`La producción del pedido '${updatedOrder.name}' ha finalizado.`, updatedOrder.id, [UserRole.Admin]);
    }

    if (!originalOrder.assignedTo && updatedOrder.assignedTo) {
      addNotification(`El pedido '${updatedOrder.name}' fue asignado a: ${updatedOrder.assignedTo}.`, updatedOrder.id, [UserRole.Admin]);
    }

    setOrders(orders.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
  };

  const selectedOrder = useMemo(
    () => orders.find(o => o.id === selectedOrderId),
    [orders, selectedOrderId]
  );
  
  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onSelectOrder={handleSelectOrder}
      />
      <main>
        {selectedOrder ? (
          <OrderDetail 
            order={selectedOrder} 
            currentUserRole={currentUserRole}
            updateOrder={updateOrder}
            onBack={() => setSelectedOrderId(null)}
          />
        ) : (
          <OrderList 
            orders={orders} 
            onSelectOrder={handleSelectOrder}
            currentUserRole={currentUserRole}
            onOpenCreateModal={() => setCreateModalOpen(true)}
          />
        )}
      </main>
      <CreateOrderModal 
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        addOrder={addOrder}
      />
    </div>
  );
};

export default App;
