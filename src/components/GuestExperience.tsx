"use client";

import { useState } from "react";
import UploadBox from "./UploadBox";
import GuestbookForm from "./GuestbookForm";

// Holds the (optional) guest name so it can be attached to both their uploads
// and their guestbook message.
export default function GuestExperience() {
  const [name, setName] = useState("");

  return (
    <div className="space-y-8">
      <div>
        <label className="mb-2 block text-lg text-sage-dark">
          Your name <span className="text-stone-400">(optional)</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Aunt Mary"
          className="w-full rounded-xl border border-sage/40 bg-white/70 px-4 py-3 text-stone-700 outline-none focus:border-sage focus:ring-2 focus:ring-sage/30"
        />
      </div>

      <UploadBox uploaderName={name} />

      <div className="border-t border-sage/20 pt-8">
        <GuestbookForm name={name} />
      </div>
    </div>
  );
}
