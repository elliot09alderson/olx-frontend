import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface DualRangeSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom"
  label?: (value: number | undefined) => React.ReactNode
  onValueCommit?: (value: number[]) => void
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(({ className, label, labelPosition = "top", ...props }, ref) => {
  const initialValue = React.useMemo(() => {
    return Array.isArray(props.value)
      ? props.value
      : Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [0, 100]
  }, [props.value, props.defaultValue])

  const [localValues, setLocalValues] = React.useState(initialValue)

  // Only update local state when props.value actually changes and we're not actively dragging
  const [isDragging, setIsDragging] = React.useState(false)
  
  React.useEffect(() => {
    if (!isDragging && Array.isArray(props.value) && 
        (props.value[0] !== localValues[0] || props.value[1] !== localValues[1])) {
      setLocalValues(props.value)
    }
  }, [props.value, isDragging, localValues])

  const handleValueChange = React.useCallback((newValues: number[]) => {
    setLocalValues(newValues)
    setIsDragging(true)
    // Only call onValueChange for visual updates, not API calls
    if (props.onValueChange) {
      props.onValueChange(newValues)
    }
  }, [props.onValueChange])

  const handleValueCommit = React.useCallback((newValues: number[]) => {
    setIsDragging(false)
    // Call onValueCommit for API updates when dragging ends
    if (props.onValueCommit) {
      props.onValueCommit(newValues)
    }
  }, [props.onValueCommit])

  const formattedMin = React.useMemo(() => {
    return label ? label(localValues[0]) : `₹${localValues[0]?.toLocaleString('en-IN')}`
  }, [localValues[0], label])

  const formattedMax = React.useMemo(() => {
    return label ? label(localValues[1]) : `₹${localValues[1]?.toLocaleString('en-IN')}`
  }, [localValues[1], label])

  return (
    <div className="relative w-full">
      {labelPosition === "top" && (
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {formattedMin}
          </span>
          <span className="text-sm text-muted-foreground">
            {formattedMax}
          </span>
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
        value={localValues}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {localValues.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
      {labelPosition === "bottom" && (
        <div className="flex justify-between mt-2">
          <span className="text-sm text-muted-foreground">
            {formattedMin}
          </span>
          <span className="text-sm text-muted-foreground">
            {formattedMax}
          </span>
        </div>
      )}
    </div>
  )
})

DualRangeSlider.displayName = "DualRangeSlider"

export { DualRangeSlider }