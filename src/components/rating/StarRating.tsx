"use client"

import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating"

export interface StarRatingProps {
  rating: number
  readOnly?: boolean
  onChange?: (value: number) => void
}

export default function StarRating({ rating, readOnly, onChange }: StarRatingProps) {
  return (
    <Rating defaultValue={rating} readOnly={readOnly} className="text-yellow-400" onValueChange={onChange}>
      {Array.from({ length: 5 }).map((_, index) => (
        <RatingButton key={index} />
      ))}
    </Rating>
  )
}
