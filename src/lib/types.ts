export type MediaItem = {
  id: string;
  file_url: string;
  file_type: "image" | "video";
  uploader_name: string | null;
  created_at: string;
};

export type GuestMessage = {
  id: string;
  guest_name: string | null;
  message: string;
  created_at: string;
};

export type Letter = {
  id: string;
  sender_name: string | null;
  email: string;
  message: string;
  deliver_at: string;
  sent_at: string | null;
  created_at: string;
};
