const API_BASE_URL = 'http://127.0.0.1:5000/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwtToken');
  }
  return null;
};

// Database functions
export const db = {
  // Vendors
  getVendors: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      console.error('Failed to fetch vendors');
      return [];
    }
    return await response.json();
  },
  getVendor: async id => { throw new Error('Not implemented'); },
  createVendor: async vendor => { throw new Error('Not implemented'); },

  // Customers
  getCustomers: async () => { throw new Error('Not implemented'); },
  getCustomer: async id => { throw new Error('Not implemented'); },
  createCustomer: async customer => { throw new Error('Not implemented'); },

  // Products
  getProducts: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      console.error('Failed to fetch products');
      return [];
    }
    return await response.json();
  },
  getProduct: async id => { throw new Error('Not implemented'); },
  createProduct: async product => { throw new Error('Not implemented'); },

  // Purchase Orders
  getPurchaseOrders: async () => { throw new Error('Not implemented'); },
  createPurchaseOrder: async po => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(po)
    });
    return await response.json();
  },

  // Sales Orders
  getSalesOrders: async () => { throw new Error('Not implemented'); },
  createSalesOrder: async so => { throw new Error('Not implemented'); },

  // Vendor Bills
  getVendorBills: async () => { throw new Error('Not implemented'); },
  createVendorBill: async bill => { throw new Error('Not implemented'); },

  // Customer Invoices
  getCustomerInvoices: async () => { throw new Error('Not implemented'); },
  createCustomerInvoice: async invoice => { throw new Error('Not implemented'); },

  // Payments
  getPayments: async () => { throw new Error('Not implemented'); },
  createPayment: async payment => { throw new Error('Not implemented'); },

  // Dashboard Stats
  getDashboardStats: async () => { throw new Error('Not implemented'); },
};