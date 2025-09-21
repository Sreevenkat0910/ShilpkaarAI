import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Slider } from '../ui/slider'
import { Checkbox } from '../ui/checkbox'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Star,
  MapPin,
  Palette,
  Wrench,
  Calendar,
  Users,
  Leaf,
  Award
} from 'lucide-react'
import { SearchFilters, FilterOptions } from '../../stores/products-store'

interface AdvancedFiltersProps {
  filters: SearchFilters
  filterOptions: FilterOptions | null
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  onClearFilters: () => void
  isLoading?: boolean
}

export default function AdvancedFilters({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
  isLoading = false
}: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['search', 'category', 'price']))
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange({ [key]: value })
  }

  const handleMultiSelectChange = (key: keyof SearchFilters, value: string, checked: boolean) => {
    const currentValue = localFilters[key] as string || ''
    const values = currentValue ? currentValue.split(',') : []
    
    if (checked) {
      values.push(value)
    } else {
      const index = values.indexOf(value)
      if (index > -1) values.splice(index, 1)
    }
    
    const newValue = values.join(',')
    handleFilterChange(key, newValue)
  }

  const handlePriceRangeChange = (value: number[]) => {
    handleFilterChange('minPrice', value[0])
    handleFilterChange('maxPrice', value[1])
  }

  const handleClearFilters = () => {
    setLocalFilters({
      sortBy: 'relevance',
      sortOrder: 'desc'
    })
    onClearFilters()
  }

  const getActiveFiltersCount = () => {
    let count = 0
    Object.entries(localFilters).forEach(([key, value]) => {
      if (key !== 'sortBy' && key !== 'sortOrder' && value !== undefined && value !== null && value !== '') {
        count++
      }
    })
    return count
  }

  const FilterSection = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    children 
  }: { 
    title: string
    icon: React.ComponentType<any>
    sectionKey: string
    children: React.ReactNode
  }) => {
    const isExpanded = expandedSections.has(sectionKey)
    
    return (
      <div className="space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {isExpanded && (
          <div className="space-y-3 pl-6">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <FilterSection title="Search" icon={Search} sectionKey="search">
          <div className="space-y-2">
            <Label htmlFor="search">Search Query</Label>
            <Input
              id="search"
              placeholder="Search products..."
              value={localFilters.q || ''}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              className="w-full"
            />
          </div>
        </FilterSection>

        <Separator />

        {/* Category & Craft */}
        <FilterSection title="Category & Craft" icon={Award} sectionKey="category">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={localFilters.category || ''}
                onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {filterOptions?.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Craft</Label>
              <Select
                value={localFilters.craft || ''}
                onValueChange={(value) => handleFilterChange('craft', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Crafts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crafts</SelectItem>
                  {filterOptions?.crafts.map((craft) => (
                    <SelectItem key={craft} value={craft}>
                      {craft}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterSection>

        <Separator />

        {/* Price Range */}
        <FilterSection title="Price Range" icon={Award} sectionKey="price">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>
                Price Range: ₹{localFilters.minPrice || 0} - ₹{localFilters.maxPrice || filterOptions?.priceRange.maxPrice || 10000}
              </Label>
              <Slider
                value={[localFilters.minPrice || 0, localFilters.maxPrice || filterOptions?.priceRange.maxPrice || 10000]}
                onValueChange={handlePriceRangeChange}
                min={filterOptions?.priceRange.minPrice || 0}
                max={filterOptions?.priceRange.maxPrice || 10000}
                step={100}
                className="w-full"
              />
            </div>
          </div>
        </FilterSection>

        <Separator />

        {/* Rating */}
        <FilterSection title="Rating" icon={Star} sectionKey="rating">
          <div className="space-y-2">
            <Label>Minimum Rating</Label>
            <Select
              value={localFilters.minRating?.toString() || ''}
              onValueChange={(value) => handleFilterChange('minRating', value === 'all' ? undefined : parseFloat(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
                <SelectItem value="1">1+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterSection>

        <Separator />

        {/* Location */}
        <FilterSection title="Location" icon={MapPin} sectionKey="location">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Region</Label>
              <Select
                value={localFilters.region || ''}
                onValueChange={(value) => handleFilterChange('region', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {filterOptions?.regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select
                value={localFilters.location || ''}
                onValueChange={(value) => handleFilterChange('location', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {filterOptions?.locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterSection>

        <Separator />

        {/* Materials */}
        <FilterSection title="Materials" icon={Palette} sectionKey="materials">
          <div className="space-y-2">
            {filterOptions?.materials.slice(0, 10).map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material}`}
                  checked={localFilters.materials?.includes(material) || false}
                  onCheckedChange={(checked) => 
                    handleMultiSelectChange('materials', material, checked as boolean)
                  }
                />
                <Label htmlFor={`material-${material}`} className="text-sm">
                  {material}
                </Label>
              </div>
            ))}
            {filterOptions?.materials.length > 10 && (
              <p className="text-xs text-muted-foreground">
                +{filterOptions.materials.length - 10} more materials
              </p>
            )}
          </div>
        </FilterSection>

        <Separator />

        {/* Colors */}
        <FilterSection title="Colors" icon={Palette} sectionKey="colors">
          <div className="space-y-2">
            {filterOptions?.colors.slice(0, 8).map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={localFilters.colors?.includes(color) || false}
                  onCheckedChange={(checked) => 
                    handleMultiSelectChange('colors', color, checked as boolean)
                  }
                />
                <Label htmlFor={`color-${color}`} className="text-sm">
                  {color}
                </Label>
              </div>
            ))}
            {filterOptions?.colors.length > 8 && (
              <p className="text-xs text-muted-foreground">
                +{filterOptions.colors.length - 8} more colors
              </p>
            )}
          </div>
        </FilterSection>

        <Separator />

        {/* Quick Filters */}
        <FilterSection title="Quick Filters" icon={Filter} sectionKey="quick">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={localFilters.featured || false}
                onCheckedChange={(checked) => handleFilterChange('featured', checked)}
              />
              <Label htmlFor="featured" className="text-sm">
                Featured Products
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trending"
                checked={localFilters.trending || false}
                onCheckedChange={(checked) => handleFilterChange('trending', checked)}
              />
              <Label htmlFor="trending" className="text-sm">
                Trending Products
              </Label>
            </div>
          </div>
        </FilterSection>

        <Separator />

        {/* Sort */}
        <FilterSection title="Sort By" icon={Award} sectionKey="sort">
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={localFilters.sortBy || 'relevance'}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={localFilters.sortOrder || 'desc'}
              onValueChange={(value) => handleFilterChange('sortOrder', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  )
}
