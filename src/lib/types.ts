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
