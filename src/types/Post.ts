export interface GetPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PostPost {
  title: string;
  body: string;
  userId: number;
}
