
import React from 'react';
import { Order, UserRole } from '../types';
import { PlusIcon } from './Icons';

interface OrderListProps {
  orders: Order[];
  onSelectOrder: (id: string) => void;
  currentUserRole: UserRole;
  onOpenCreateModal: () => void;
}

const OrderCard: React.FC<{ order: Order; onSelectOrder: (id: string) => void }> = ({ order, onSelectOrder }) => {
    const totalItems = order.items.length;
    const designComplete = order.items.filter(item => item.isDesignComplete).length;
    const productionComplete = order.items.filter(item => item.isProductionComplete).length;
    
    const designProgress = totalItems > 0 ? (designComplete / totalItems) * 100 : 0;
    const productionProgress = totalItems > 0 ? (productionComplete / totalItems) * 100 : 0;

    const getStatus = () => {
        if (order.deliveryDate) return <span className="text-green-400 font-semibold">Entregado</span>;
        if (productionComplete === totalItems && totalItems > 0) return <span className="text-cyan-400 font-semibold">Producción Finalizada</span>;
        if (designComplete === totalItems && totalItems > 0) return <span className="text-orange-400 font-semibold">Diseño Finalizado</span>;
        return <span className="text-yellow-400 font-semibold">En Proceso</span>;
    }

    return (
        <div 
            className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-700 transition-colors duration-200 cursor-pointer flex flex-col justify-between"
            onClick={() => onSelectOrder(order.id)}
        >
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white mb-2">{order.name}</h3>
                    <div className="text-sm px-2 py-1 bg-gray-600 rounded-full">{getStatus()}</div>
                </div>
                <p className="text-gray-400 mb-4">Cliente: {order.client}</p>
            </div>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Diseño</span>
                        <span>{designComplete}/{totalItems}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${designProgress}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Producción</span>
                        <span>{productionComplete}/{totalItems}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${productionProgress}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}


const OrderList: React.FC<OrderListProps> = ({ orders, onSelectOrder, currentUserRole, onOpenCreateModal }) => {
  return (
    <div className="container mx-auto p-4 md:p-8">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Listado de Pedidos</h2>
        {currentUserRole === UserRole.Admin && (
          <button 
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <PlusIcon />
            <span>Nuevo Pedido</span>
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
            <h3 className="text-2xl text-gray-400">No hay pedidos cargados.</h3>
            <p className="text-gray-500 mt-2">
                {currentUserRole === UserRole.Admin ? "Crea un nuevo pedido para comenzar." : "Espera a que un administrador cargue un pedido."}
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
                <OrderCard key={order.id} order={order} onSelectOrder={onSelectOrder} />
            ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
