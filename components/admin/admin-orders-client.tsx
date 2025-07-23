'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, User, MapPin, CreditCard, Banknote, Search, Filter } from 'lucide-react'
import Image from 'next/image'
import { OrderStatus, PaymentMethod } from '@prisma/client'

interface Order {
  id: string
  status: OrderStatus
  total: number
  createdAt: Date
  paymentStatus: string
  paymentMethod: PaymentMethod
  deliveryFirstName?: string
  deliveryLastName?: string
  deliveryStreet?: string
  deliveryCity?: string
  deliveryPostalCode?: string
  deliveryCountry?: string
  user: {
    id: string
    name: string
    email: string
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      title: string
      seller: {
        id: string
        user: {
          name: string
        }
      }
      images: Array<{
        url: string
        altText?: string
      }>
    }
  }>
}

interface AdminOrdersClientProps {
  orders: Order[]
}

export default function AdminOrdersClient({ orders }: AdminOrdersClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.seller.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
        <p className="text-gray-600">Aucune commande n'a encore été passée sur la plateforme.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par commande, client, produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="CONFIRMED">Confirmée</SelectItem>
            <SelectItem value="SHIPPED">Expédiée</SelectItem>
            <SelectItem value="DELIVERED">Livrée</SelectItem>
            <SelectItem value="CANCELLED">Annulée</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par paiement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les paiements</SelectItem>
            <SelectItem value="CARD">Carte bancaire</SelectItem>
            <SelectItem value="PAYPAL">PayPal</SelectItem>
            <SelectItem value="CASH_ON_DELIVERY">Paiement à la livraison</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {filteredOrders.length} commande(s) trouvée(s) sur {orders.length} au total
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Vendeur</TableHead>
              <TableHead>Produits</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">#{order.id.slice(-8)}</div>
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
                  <div className="text-sm">
                    {order.items[0]?.product.seller.user.name}
                    {order.items.length > 1 && (
                      <div className="text-xs text-gray-500">
                        +{order.items.length - 1} autre(s)
                      </div>
                    )}
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
                          +{order.items.length - 1} article(s)
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {getPaymentMethodIcon(order.paymentMethod)}
                    <span className="text-sm">{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>
                  <div className="text-xs text-gray-500">{order.paymentStatus}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">€{order.total.toFixed(2)}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(order.createdAt)}</div>
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

              {/* Customer and Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Informations client
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedOrder.user.name}</div>
                      <div><strong>Email:</strong> {selectedOrder.user.email}</div>
                      <div><strong>ID:</strong> {selectedOrder.user.id}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      {getPaymentMethodIcon(selectedOrder.paymentMethod)}
                      <span className="ml-2">Paiement</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Méthode:</strong> {getPaymentMethodLabel(selectedOrder.paymentMethod)}</div>
                      <div><strong>Statut:</strong> {selectedOrder.paymentStatus}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Address */}
              {(selectedOrder.deliveryStreet || selectedOrder.deliveryCity) && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Adresse de livraison
                    </h4>
                    <div className="text-sm">
                      <div>{selectedOrder.deliveryFirstName} {selectedOrder.deliveryLastName}</div>
                      <div>{selectedOrder.deliveryStreet}</div>
                      <div>{selectedOrder.deliveryPostalCode} {selectedOrder.deliveryCity}</div>
                      <div>{selectedOrder.deliveryCountry}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                            Vendeur: {item.product.seller.user.name}
                          </div>
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
