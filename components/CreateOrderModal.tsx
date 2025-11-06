
import React, { useState } from 'react';
import { Order, OrderItem } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  addOrder: (order: Omit<Order, 'id'>) => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose, addOrder }) => {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [details, setDetails] = useState('');
  const [items, setItems] = useState<Omit<OrderItem, 'id' | 'isDesignComplete' | 'isProductionComplete'>[]>([
    { size: '', detail1: '', detail2: '' },
  ]);

  const handleItemChange = (index: number, field: keyof Omit<OrderItem, 'id'>, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { size: '', detail1: '', detail2: '' }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !client) {
        alert("Por favor, complete el nombre del pedido y el cliente.");
        return;
    }
    const newOrder: Omit<Order, 'id'> = {
      name,
      client,
      details,
      items: items.map(item => ({
        ...item,
        id: crypto.randomUUID(),
        isDesignComplete: false,
        isProductionComplete: false,
      })),
      startDate: new Date().toISOString().split('T')[0],
      designEndDate: null,
      productionEndDate: null,
      deliveryDate: null,
      assignedTo: null,
    };
    addOrder(newOrder);
    onClose();
    // Reset form
    setName('');
    setClient('');
    setDetails('');
    setItems([{ size: '', detail1: '', detail2: '' }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Crear Nuevo Pedido</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nombre General del Pedido"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Cliente"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
          </div>
          <textarea
            placeholder="Detalles adicionales..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded w-full mb-4 h-24"
          />

          <h3 className="text-xl font-semibold mb-2">Listado de Items</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-700 p-2 rounded">
                <input
                  type="text"
                  placeholder="Talle"
                  value={item.size}
                  onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                  className="bg-gray-600 text-white p-2 rounded w-1/4"
                />
                <input
                  type="text"
                  placeholder="Detalle 1 (Nombre)"
                  value={item.detail1}
                  onChange={(e) => handleItemChange(index, 'detail1', e.target.value)}
                  className="bg-gray-600 text-white p-2 rounded w-1/3"
                />
                <input
                  type="text"
                  placeholder="Detalle 2 (Número)"
                  value={item.detail2}
                  onChange={(e) => handleItemChange(index, 'detail2', e.target.value)}
                  className="bg-gray-600 text-white p-2 rounded w-1/3"
                />
                <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-400 p-2">
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="mt-2 flex items-center space-x-1 text-green-400 hover:text-green-300">
            <PlusIcon/> <span>Añadir Item</span>
          </button>

          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
              Crear Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
