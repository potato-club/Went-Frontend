export type Review = {
  postId: number;
  title: string;
  content: string;
  createdAt: string;
  categoryId: number;
  viewCount: number;
  commentCount: number;
  stars: number;
  thumbnailUrl?: string;
};
