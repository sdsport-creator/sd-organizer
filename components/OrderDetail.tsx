
import React, { useState, useEffect } from 'react';
import { Order, OrderItem, UserRole } from '../types';
import { ArrowLeftIcon, EditIcon, PlusIcon, TrashIcon } from './Icons';

interface OrderDetailProps {
  order: Order;
  currentUserRole: UserRole;
  updateOrder: (updatedOrder: Order) => void;
  onBack: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, currentUserRole, updateOrder, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableOrder, setEditableOrder] = useState<Order>(JSON.parse(JSON.stringify(order)));

  useEffect(() => {
    setEditableOrder(JSON.parse(JSON.stringify(order)));
    setIsEditing(false);
  }, [order]);

  const handleItemStatusToggle = (itemId: string, type: 'design' | 'production') => {
    const updatedOrder = { ...order };
    const item = updatedOrder.items.find(i => i.id === itemId);
    if (item) {
      if (type === 'design') {
        item.isDesignComplete = !item.isDesignComplete;
      } else {
        item.isProductionComplete = !item.isProductionComplete;
      }
      updateOrder(updatedOrder);
    }
  };
  
  const handleDateChange = (field: keyof Order, value: string) => {
    updateOrder({ ...order, [field]: value });
  };
  
  const handleAssignedToChange = (value: string) => {
    updateOrder({ ...order, assignedTo: value });
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleItemEditChange = (index: number, field: keyof OrderItem, value: string) => {
    const newItems = [...editableOrder.items];
    (newItems[index] as any)[field] = value;
    setEditableOrder(prev => ({ ...prev, items: newItems }));
  }

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: crypto.randomUUID(),
      size: '',
      detail1: '',
      detail2: '',
      isDesignComplete: false,
      isProductionComplete: false,
    };
    setEditableOrder(prev => ({...prev, items: [...prev.items, newItem]}));
  }

  const handleRemoveItem = (index: number) => {
    const newItems = editableOrder.items.filter((_, i) => i !== index);
    setEditableOrder(prev => ({...prev, items: newItems}));
  }

  const saveChanges = () => {
    updateOrder(editableOrder);
    setIsEditing(false);
  }

  const isAdmin = currentUserRole === UserRole.Admin;
  const isDesigner = currentUserRole === UserRole.Designer;
  const isProducer = currentUserRole === UserRole.Producer;

  const renderStatusPill = (item: OrderItem) => {
    if (item.isProductionComplete) {
      return <span className="px-2 py-1 text-xs font-semibold text-white bg-cyan-600 rounded-full">Producción OK</span>;
    }
    if (item.isDesignComplete) {
      return <span className="px-2 py-1 text-xs font-semibold text-white bg-orange-600 rounded-full">Diseño OK</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-600 rounded-full">Pendiente</span>;
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <button onClick={onBack} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
        <ArrowLeftIcon />
        <span>Volver a la lista</span>
      </button>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
             <input type="text" name="name" value={editableOrder.name} onChange={handleEditChange} className="text-3xl font-bold bg-gray-700 p-2 rounded w-1/2"/>
          ) : (
             <h2 className="text-3xl font-bold">{order.name}</h2>
          )}
          {isAdmin && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded-lg">
              <EditIcon /> <span>Editar Pedido</span>
            </button>
          )}
        </div>
        
        {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
                 <input type="text" name="client" value={editableOrder.client} onChange={handleEditChange} className="bg-gray-700 p-2 rounded" placeholder="Cliente"/>
                 <textarea name="details" value={editableOrder.details} onChange={handleEditChange} className="bg-gray-700 p-2 rounded col-span-2" placeholder="Detalles"/>
            </div>
        ) : (
            <>
              <p className="text-lg text-gray-300">Cliente: <span className="font-semibold text-white">{order.client}</span></p>
              <p className="text-gray-400 mt-2">{order.details}</p>
            </>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 overflow-x-auto">
        <h3 className="text-2xl font-bold mb-4">Items del Pedido</h3>
        <table className="w-full text-left">
          <thead className="border-b-2 border-gray-700">
            <tr>
              <th className="p-3">Talle</th>
              <th className="p-3">Detalle 1 (Nombre)</th>
              <th className="p-3">Detalle 2 (Número)</th>
              <th className="p-3 text-center">Status</th>
              {isEditing && <th className="p-3"></th>}
            </tr>
          </thead>
          <tbody>
            {(isEditing ? editableOrder.items : order.items).map((item, index) => (
              <tr 
                key={item.id} 
                className={`border-b border-gray-700 
                  ${!isEditing && item.isProductionComplete ? 'bg-cyan-900/50' : ''} 
                  ${!isEditing && !item.isProductionComplete && item.isDesignComplete ? 'bg-orange-900/50' : ''}`
                }
              >
                {isEditing ? (
                    <>
                        <td><input type="text" value={item.size} onChange={e => handleItemEditChange(index, 'size', e.target.value)} className="bg-gray-700 p-2 rounded w-full"/></td>
                        <td><input type="text" value={item.detail1} onChange={e => handleItemEditChange(index, 'detail1', e.target.value)} className="bg-gray-700 p-2 rounded w-full"/></td>
                        <td><input type="text" value={item.detail2} onChange={e => handleItemEditChange(index, 'detail2', e.target.value)} className="bg-gray-700 p-2 rounded w-full"/></td>
                        <td className="p-3 text-center">-</td>
                        <td><button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-400 p-2"><TrashIcon /></button></td>
                    </>
                ) : (
                    <>
                        <td className="p-3">{item.size}</td>
                        <td className="p-3">{item.detail1}</td>
                        <td className="p-3">{item.detail2}</td>
                        <td className="p-3 text-center">
                            {isDesigner && <input type="checkbox" checked={item.isDesignComplete} onChange={() => handleItemStatusToggle(item.id, 'design')} className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500 shadow-glow-orange"/>}
                            {isProducer && <input type="checkbox" checked={item.isProductionComplete} onChange={() => handleItemStatusToggle(item.id, 'production')} className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500 shadow-glow-cyan"/>}
                            {!isDesigner && !isProducer && renderStatusPill(item)}
                        </td>
                    </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {isEditing && (
            <button onClick={handleAddItem} className="mt-4 flex items-center space-x-1 text-green-400 hover:text-green-300"><PlusIcon/> <span>Añadir Item</span></button>
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4 mt-6">
            <button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancelar</button>
            <button onClick={saveChanges} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">Guardar Cambios</button>
        </div>
      )}
      
      {!isEditing && <div className="mt-6 bg-gray-800 rounded-lg shadow-xl p-6">
        <h3 className="text-2xl font-bold mb-4">Fechas y Asignación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Fecha Ingreso</label>
                <input type="date" value={order.startDate || ''} onChange={e => handleDateChange('startDate', e.target.value)} disabled={!isAdmin} className="bg-gray-700 p-2 rounded disabled:opacity-50"/>
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Fin Diseño</label>
                <input type="date" value={order.designEndDate || ''} onChange={e => handleDateChange('designEndDate', e.target.value)} disabled={!isDesigner} className="bg-gray-700 p-2 rounded disabled:opacity-50"/>
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Fin Producción</label>
                <input type="date" value={order.productionEndDate || ''} onChange={e => handleDateChange('productionEndDate', e.target.value)} disabled={!isProducer} className="bg-gray-700 p-2 rounded disabled:opacity-50"/>
            </div>
             <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Fecha Entrega</label>
                <input type="date" value={order.deliveryDate || ''} onChange={e => handleDateChange('deliveryDate', e.target.value)} disabled={!isAdmin} className="bg-gray-700 p-2 rounded disabled:opacity-50"/>
            </div>
            <div className="flex flex-col md:col-span-2 lg:col-span-4">
                <label className="text-sm text-gray-400 mb-1">Derivado a</label>
                <input type="text" value={order.assignedTo || ''} onChange={e => handleAssignedToChange(e.target.value)} disabled={!isProducer} placeholder="Nombre de a quién se deriva" className="bg-gray-700 p-2 rounded disabled:opacity-50"/>
            </div>
        </div>
      </div>}
    </div>
  );
};

export default OrderDetail;
