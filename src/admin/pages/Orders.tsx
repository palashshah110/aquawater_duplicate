import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  Trash2,
  MoreVertical,
  Filter,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// Mock data
const initialOrders = [
  {
    id: '1',
    orderId: 'SF2024001',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul@email.com',
      phone: '9876543210',
    },
    shippingAddress: {
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
    product: {
      name: 'Smart Water Tank Overflow Alarm',
      price: 2499,
      quantity: 1,
    },
    totalAmount: 2499,
    orderStatus: 'delivered',
    paymentStatus: 'completed',
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    orderId: 'SF2024002',
    customer: {
      name: 'Priya Patel',
      email: 'priya@email.com',
      phone: '9876543211',
    },
    shippingAddress: {
      address: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    product: {
      name: 'Auto Cut-Off Controller Pro',
      price: 3999,
      quantity: 1,
    },
    totalAmount: 3999,
    orderStatus: 'shipped',
    paymentStatus: 'completed',
    createdAt: '2024-01-16T14:20:00',
  },
  {
    id: '3',
    orderId: 'SF2024003',
    customer: {
      name: 'Amit Kumar',
      email: 'amit@email.com',
      phone: '9876543212',
    },
    shippingAddress: {
      address: '789 Lake View',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    },
    product: {
      name: 'WiFi Smart Tank Monitor',
      price: 5499,
      quantity: 1,
    },
    totalAmount: 5499,
    orderStatus: 'processing',
    paymentStatus: 'completed',
    createdAt: '2024-01-17T09:15:00',
  },
  {
    id: '4',
    orderId: 'SF2024004',
    customer: {
      name: 'Sneha Reddy',
      email: 'sneha@email.com',
      phone: '9876543213',
    },
    shippingAddress: {
      address: '321 Hill Road',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
    },
    product: {
      name: 'Water Level Sensor Kit',
      price: 1799,
      quantity: 2,
    },
    totalAmount: 3598,
    orderStatus: 'confirmed',
    paymentStatus: 'completed',
    createdAt: '2024-01-18T11:45:00',
  },
  {
    id: '5',
    orderId: 'SF2024005',
    customer: {
      name: 'Vikram Singh',
      email: 'vikram@email.com',
      phone: '9876543214',
    },
    shippingAddress: {
      address: '654 Garden City',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    },
    product: {
      name: 'Dual Tank Controller',
      price: 4799,
      quantity: 1,
    },
    totalAmount: 4799,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    createdAt: '2024-01-19T16:30:00',
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusOptions = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof initialOrders[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: typeof initialOrders[0]) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
    toast.success('Order status updated');
  };

  const handleDelete = (id: string) => {
    setOrderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      setOrders(orders.filter((o) => o.id !== orderToDelete));
      toast.success('Order deleted successfully');
    }
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                  Order ID
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Product
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                  Date
                </th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-primary">{order.orderId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <p className="line-clamp-1">{order.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {order.product.quantity}
                    </p>
                  </td>
                  <td className="py-4 px-4 font-medium">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <Select
                      value={order.orderStatus}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            statusColors[order.orderStatus]
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status} className="capitalize">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </motion.div>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderId}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p>{selectedOrder.customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.customer.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.customer.phone}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Product</h4>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💧</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedOrder.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {selectedOrder.product.quantity}
                    </p>
                  </div>
                  <p className="font-bold">
                    ₹{selectedOrder.product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      statusColors[selectedOrder.orderStatus]
                    }`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-gradient">
                    ₹{selectedOrder.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Date */}
              <p className="text-sm text-muted-foreground text-center">
                Order placed on {formatDate(selectedOrder.createdAt)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Orders;
