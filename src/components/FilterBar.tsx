import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface FilterBarProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const FilterBar = ({ activeFilters, onFilterChange }: FilterBarProps) => {

  const categories = ["All", "Shoes", "Tops", "Accessories"];

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilters.includes(category) ? "default" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() => {
                  if (category === "All") {
                    onFilterChange([]);
                  } else {
                    onFilterChange(
                      activeFilters.includes(category)
                        ? activeFilters.filter((f) => f !== category)
                        : [...activeFilters, category]
                    );
                  }
                }}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Color <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Size <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Features <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-sm"
              >
                {filter}
              </span>
            ))}
            <button
              onClick={() => onFilterChange([])}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
