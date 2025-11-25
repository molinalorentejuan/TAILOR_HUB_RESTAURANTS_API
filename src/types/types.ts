export interface CreateReviewServiceInput {
  user_id: number;
  restaurant_id: number;
  rating: number;
  comments?: string;
}