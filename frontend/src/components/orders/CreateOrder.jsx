import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import { FiMinus, FiPlus, FiShoppingCart, FiPackage } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import toast from 'react-hot-toast';

const CreateOrder = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const fetchRestaurantAndMenu = async () => {
    try {
      setLoading(true);
      const [restaurantData, menuData] = await Promise.all([
        restaurantService.getById(restaurantId),
        restaurantService.getMenuItems(restaurantId)
      ]);
      
      setRestaurant(restaurantData);
      setMenuItems(menuData);
    } catch (err) {
      setError('Failed to load restaurant menu. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (menuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === menuItem.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...menuItem, quantity: 1 }];
      }
    });
    
    toast.success(`${menuItem.name} added to cart!`);
  };

  const removeFromCart = (menuItemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === menuItemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== menuItemId);
      }
    });
  };

  const removeItemCompletely = (menuItemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== menuItemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    if (cart.length === 0) {
      toast.error('Please add items to your cart');
      return;
    }

    try {
      const orderData = {
        customerId: user.id,
        restaurantId: parseInt(restaurantId),
        deliveryAddress,
        specialInstructions,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };

      setLoading(true);
      const order = await orderService.create(orderData);
      
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading menu..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRestaurantAndMenu} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Menu Items */}
        <div className="lg:col-span-2">
          {/* Restaurant Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
                <p className="text-gray-600">{restaurant.cuisineType}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Delivery time</div>
                <div className="font-semibold">30-40 min</div>
              </div>
            </div>
            <p className="text-gray-700">{restaurant.description}</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            
            {menuItems.length === 0 ? (
              <div className="text-center py-8">
                <FiPackage className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No menu items available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="card hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      </div>
                      <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="btn-primary w-full"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Cart & Checkout */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {/* Cart Summary */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Order</h2>
                <FiShoppingCart className="text-gray-600" />
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <FiShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-gray-400 text-sm">Add items from the menu</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-gray-600 text-sm">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <FiPlus size={14} />
                          </button>
                          <span className="font-bold text-gray-900 w-16 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItemCompletely(item.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Total */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-semibold">$2.99</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">${(calculateTotal() * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                      <span>Total</span>
                      <span>${(calculateTotal() + 2.99 + (calculateTotal() * 0.08)).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Checkout Form */}
            {cart.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Delivery Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="input-field h-24"
                      placeholder="Enter your delivery address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="input-field h-24"
                      placeholder="Any special instructions for delivery?"
                    />
                  </div>

                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="w-full btn-primary py-3 text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Placing Order...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;