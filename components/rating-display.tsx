import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  reviewCount: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
}

export function RatingDisplay({ rating, reviewCount, size = "md", showCount = true }: RatingDisplayProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className={`${textSizeClasses[size]} text-muted-foreground`}>
          {rating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  )
}
