export type ICreateReviewPayload = {
  rating: number;
  review?: string;
};

export type IUpdateReviewPayload = Partial<ICreateReviewPayload>;
