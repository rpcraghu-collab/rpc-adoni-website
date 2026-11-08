// Gallery photo uploads (admin only). Unsigned preset, locked in Cloudinary to the rpc-gallery folder,
// images only, max 10 MB. Cloud name and preset name are not secrets.
export const CLOUDINARY = { cloud: 'CLOUD_NAME', preset: 'rpc_gallery' }

export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY.preset)
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloud}/image/upload`, { method: 'POST', body: fd })
  const j = await r.json()
  if (!r.ok || typeof j.secure_url !== 'string') throw new Error(j?.error?.message || 'Upload failed')
  return j.secure_url
}

/** Resized, auto-format delivery URL for a Cloudinary image. */
export const cldUrl = (url: string, w: number) => url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${w}/`)
