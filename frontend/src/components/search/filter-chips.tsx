import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { SearchFilters } from '../../stores/products-store'

interface FilterChipsProps {
  filters: SearchFilters
  onRemoveFilter: (key: keyof SearchFilters) => void
  onClearAll: () => void
  className?: string
}

export default function FilterChips({
  filters,
  onRemoveFilter,
  onClearAll,
  className = ""
}: FilterChipsProps) {
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: keyof SearchFilters; label: string; value: string }> = []

    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return
      
      if (value !== undefined && value !== null && value !== '') {
        let label = ''
        let displayValue = ''

        switch (key) {
          case 'q':
            label = 'Search'
            displayValue = `"${value}"`
            break
          case 'category':
            label = 'Category'
            displayValue = value as string
            break
          case 'subcategory':
            label = 'Subcategory'
            displayValue = value as string
            break
          case 'craft':
            label = 'Craft'
            displayValue = value as string
            break
          case 'artisan':
            label = 'Artisan'
            displayValue = value as string
            break
          case 'location':
            label = 'Location'
            displayValue = value as string
            break
          case 'region':
            label = 'Region'
            displayValue = value as string
            break
          case 'minPrice':
            label = 'Min Price'
            displayValue = `₹${value}`
            break
          case 'maxPrice':
            label = 'Max Price'
            displayValue = `₹${value}`
            break
          case 'minRating':
            label = 'Min Rating'
            displayValue = `${value}+ stars`
            break
          case 'materials':
            label = 'Materials'
            displayValue = (value as string).split(',').join(', ')
            break
          case 'colors':
            label = 'Colors'
            displayValue = (value as string).split(',').join(', ')
            break
          case 'techniques':
            label = 'Techniques'
            displayValue = (value as string).split(',').join(', ')
            break
          case 'occasions':
            label = 'Occasions'
            displayValue = (value as string).split(',').join(', ')
            break
          case 'ageGroup':
            label = 'Age Group'
            displayValue = value as string
            break
          case 'gender':
            label = 'Gender'
            displayValue = value as string
            break
          case 'season':
            label = 'Season'
            displayValue = value as string
            break
          case 'sustainability':
            label = 'Sustainability'
            displayValue = value as string
            break
          case 'condition':
            label = 'Condition'
            displayValue = value as string
            break
          case 'availability':
            label = 'Availability'
            displayValue = value as string
            break
          case 'featured':
            if (value) {
              label = 'Featured'
              displayValue = 'Yes'
            }
            break
          case 'trending':
            if (value) {
              label = 'Trending'
              displayValue = 'Yes'
            }
            break
        }

        if (label && displayValue) {
          activeFilters.push({
            key: key as keyof SearchFilters,
            label,
            value: displayValue
          })
        }
      }
    })

    return activeFilters
  }

  const activeFilters = getActiveFilters()

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
      
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          <span className="text-xs">
            <span className="font-medium">{filter.label}:</span> {filter.value}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter(filter.key)}
            className="h-4 w-4 p-0 hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
      >
        Clear all
      </Button>
    </div>
  )
}
