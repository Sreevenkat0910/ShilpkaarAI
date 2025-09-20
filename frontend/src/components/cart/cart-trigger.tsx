import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ShoppingCart } from 'lucide-react'
import { useCart } from './cart-context'

export default function CartTrigger() {
  const { getTotalItems, setIsOpen } = useCart()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative hover:bg-secondary/60 hover:scale-105 transition-all"
      onClick={() => setIsOpen(true)}
    >
      <ShoppingCart className="h-5 w-5" />
      {getTotalItems() > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-primary border-0 shadow-sm">
          {getTotalItems()}
        </Badge>
      )}
    </Button>
  )
}
