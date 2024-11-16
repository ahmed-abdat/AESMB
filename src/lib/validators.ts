export function validateImageFile(file: File) {
  // Check file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    throw new Error("L'image ne doit pas dépasser 2MB");
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format d'image non supporté. Utilisez JPG, PNG ou WebP");
  }

  return true;
} 