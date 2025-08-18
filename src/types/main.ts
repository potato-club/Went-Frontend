export type Post = {
  postId: number;
  title: string;
  likeCount: number;
  stars: number;
  thumbnailUrl: string;
  createdDate: string;
  viewCount: number;
};

export type CategoryResponse = {
  categoryId: number;
  categoryName: string;
  posts: Post[];
};
