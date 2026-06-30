// Browser-only helpers for turning the user's uploads into compact
// base64 images we can POST to the extraction API. Keeping frames small
// keeps requests well under serverless body limits and speeds up the model.

export type EncodedImage = {
  mediaType: "image/jpeg";
  data: string; // base64, no data: prefix
  preview: string; // full data URL for showing a thumbnail
};

const MAX_DIMENSION = 1280; // longest edge, px
const JPEG_QUALITY = 0.72;

function canvasToEncoded(canvas: HTMLCanvasElement): EncodedImage {
  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  const data = dataUrl.split(",")[1] ?? "";
  return { mediaType: "image/jpeg", data, preview: dataUrl };
}

function drawScaled(
  source: CanvasImageSource,
  width: number,
  height: number,
): HTMLCanvasElement {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process that image.");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// Decode an image File and re-encode it downscaled.
export function encodeImageFile(file: File): Promise<EncodedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = drawScaled(img, img.naturalWidth, img.naturalHeight);
        resolve(canvasToEncoded(canvas));
      } catch (e) {
        reject(e);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That image couldn't be opened."));
    };
    img.src = url;
  });
}

// Sample several frames across a video File. We spread the grabs over the
// clip so on-screen ingredient lists / text at different moments get captured.
export function extractVideoFrames(
  file: File,
  maxFrames = 5,
): Promise<EncodedImage[]> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    const frames: EncodedImage[] = [];
    let timestamps: number[] = [];
    let index = 0;
    let settled = false;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      video.load();
    };
    const fail = (msg: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(msg));
    };
    const done = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(frames);
    };

    const grab = () => {
      if (index >= timestamps.length) return done();
      video.currentTime = Math.min(timestamps[index], video.duration - 0.05);
    };

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (duration <= 0) {
        // Some encodings report no duration; just grab the first frame.
        timestamps = [0];
      } else {
        const count = Math.max(1, Math.min(maxFrames, Math.ceil(duration / 2)));
        // Spread across the middle 90% so we skip black intro/outro frames.
        timestamps = Array.from({ length: count }, (_, i) =>
          duration * (0.05 + (0.9 * i) / Math.max(1, count - 1)),
        );
      }
      grab();
    };

    video.onseeked = () => {
      try {
        const canvas = drawScaled(video, video.videoWidth, video.videoHeight);
        frames.push(canvasToEncoded(canvas));
      } catch {
        // Skip a frame that failed to draw rather than aborting the whole video.
      }
      index += 1;
      grab();
    };

    video.onerror = () => fail("That video couldn't be read in your browser.");

    // Safety valve: never hang forever on a stubborn file.
    setTimeout(() => {
      if (frames.length > 0) done();
      else fail("Reading the video took too long. Try a screenshot instead.");
    }, 30000);
  });
}
