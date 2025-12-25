export interface Notification {
  id: number;
  text: string;
  time: string;
  title?: string;
  type?: string;
  is_read?: boolean;
}