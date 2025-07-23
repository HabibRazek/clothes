'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, User, MapPin, CreditCard, Banknote } from 'lucide-react'
import Image from 'next/image'
import { updateOrderStatus } from '@/lib/actions/orders'
import { OrderStatus, PaymentMethod } from '@prisma/client'

interface Order {
  id: string
  status: OrderStatus
  total: number
  createdAt: Date
  paymentStatus: string
  paymentMethod: PaymentMethod
  user: {
    name: string
    email: string
  }
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      title: string
      images: Array<{
        url: string
        altText?: string
      }>
    }
  }>
}

interface SellerOrdersClientProps {
  orders: Order[]
}

export default function SellerOrdersClient({ orders }: SellerOrdersClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'CARD':
        return 'Carte bancaire'
      case 'PAYPAL':
        return 'PayPal'
      case 'CASH_ON_DELIVERY':
        return 'Paiement à la livraison'
      case 'BANK_TRANSFER':
        return 'Virement bancaire'
      default:
        return method
    }
  }

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'CARD':
        return <CreditCard className="h-3 w-3" />
      case 'PAYPAL':
        return <CreditCard className="h-3 w-3" />
      case 'CASH_ON_DELIVERY':
        return <Banknote className="h-3 w-3" />
      case 'BANK_TRANSFER':
        return <CreditCard className="h-3 w-3" />
      default:
        return <CreditCard className="h-3 w-3" />
    }
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { label: 'En attente', variant: 'secondary' as const, icon: Clock },
      CONFIRMED: { label: 'Confirmée', variant: 'default' as const, icon: CheckCircle },
      SHIPPED: { label: 'Expédiée', variant: 'default' as const, icon: Truck },
      DELIVERED: { label: 'Livrée', variant: 'default' as const, icon: CheckCircle },
      CANCELLED: { label: 'Annulée', variant: 'destructive' as const, icon: XCircle },
      REFUNDED: { label: 'Remboursée', variant: 'outline' as const, icon: XCircle }
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true)
    try {
      const result = await updateOrderStatus(orderId, newStatus)
      if (result.success) {
        window.location.reload() // Simple refresh for now
      } else {
        alert(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
        <p className="text-gray-600">Vous n'avez pas encore reçu de commandes.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Produits</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">#{order.id.slice(-8)}</div>
                  <div className="text-sm text-gray-500 flex items-center space-x-1">
                    {getPaymentMethodIcon(order.paymentMethod)}
                    <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Status: {order.paymentStatus}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium">{order.user.name}</div>
                      <div className="text-sm text-gray-500">{order.user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {order.items[0]?.product.images?.[0] && (
                      <div className="w-10 h-10 relative rounded overflow-hidden">
                        <Image
                          src={order.items[0].product.images[0].url}
                          alt={order.items[0].product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-sm">{order.items[0]?.product.title}</div>
                      {order.items.length > 1 && (
                        <div className="text-xs text-gray-500">
                          +{order.items.length - 1} autre(s)
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">€{order.total.toFixed(2)}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(order.createdAt)}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order)
                        setIsDetailDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {order.status === 'PENDING' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                        disabled={isUpdating}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Confirmer
                      </Button>
                    )}
                    
                    {order.status === 'CONFIRMED' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Expédier
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande #{selectedOrder?.id.slice(-8)}</DialogTitle>
            <DialogDescription>
              Informations complètes sur la commande
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Statut de la commande</div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-xl font-bold">€{selectedOrder.total.toFixed(2)}</div>
                </div>
              </div>

              {/* Payment Method Info */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    {getPaymentMethodIcon(selectedOrder.paymentMethod)}
                    <span className="ml-2">Mode de paiement</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</span>
                      <Badge variant={selectedOrder.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                    {selectedOrder.paymentMethod === 'CASH_ON_DELIVERY' && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Banknote className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-amber-800">Paiement à la livraison</p>
                            <p className="text-amber-700 mt-1">
                              Le client paiera <strong>€{selectedOrder.total.toFixed(2)}</strong> en espèces lors de la livraison.
                              Assurez-vous d'avoir la monnaie nécessaire.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Informations client
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nom:</strong> {selectedOrder.user.name}</div>
                    <div><strong>Email:</strong> {selectedOrder.user.email}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Adresse de livraison
                  </h4>
                  <div className="text-sm">
                    <div>{selectedOrder.address.street}</div>
                    <div>{selectedOrder.address.postalCode} {selectedOrder.address.city}</div>
                    <div>{selectedOrder.address.country}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Produits commandés
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        {item.product.images?.[0] && (
                          <div className="w-16 h-16 relative rounded overflow-hidden">
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{item.product.title}</div>
                          <div className="text-sm text-gray-600">
                            Quantité: {item.quantity} × €{item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="font-medium">
                          €{(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Update */}
              {selectedOrder.status !== 'DELIVERED' && selectedOrder.status !== 'CANCELLED' && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Mettre à jour le statut</h4>
                    <div className="flex space-x-2">
                      {selectedOrder.status === 'PENDING' && (
                        <Button
                          onClick={() => handleStatusUpdate(selectedOrder.id, 'CONFIRMED')}
                          disabled={isUpdating}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmer la commande
                        </Button>
                      )}
                      {selectedOrder.status === 'CONFIRMED' && (
                        <Button
                          onClick={() => handleStatusUpdate(selectedOrder.id, 'SHIPPED')}
                          disabled={isUpdating}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Marquer comme expédiée
                        </Button>
                      )}
                      {selectedOrder.status === 'SHIPPED' && (
                        <Button
                          onClick={() => handleStatusUpdate(selectedOrder.id, 'DELIVERED')}
                          disabled={isUpdating}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Marquer comme livrée
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
