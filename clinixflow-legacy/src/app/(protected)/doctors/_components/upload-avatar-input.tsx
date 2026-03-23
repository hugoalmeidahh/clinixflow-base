'use client';

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";



interface UploadAvatarProps {
  onFileSelect: (file: File) => void;
  initialPreviewUrl?: string | null;
}

export default function UploadAvatar({
  onFileSelect,
  initialPreviewUrl = null
}: UploadAvatarProps) {
  const t = useTranslations("doctors");
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);
    if (!file) return;

    // Validações básicas
    if (!file.type.startsWith('image/')) {
      alert(t("selectImageFile"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(t("maxImageSize"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileSelect(file);

    // Limpeza de memória
    return () => URL.revokeObjectURL(objectUrl);
  };

  useEffect(() => {
    setPreviewUrl(initialPreviewUrl);
  }, [initialPreviewUrl]);

  return (
    <div className="space-y-2 flex items-center justify-between gap-4">
      {previewUrl && (
        <div className="relative h-20 w-24 rounded-full overflow-hidden border-2 border-blue-500">
          <Image
            src={previewUrl}
            alt={t("avatarPreview")}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-muted-foreground
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-primary file:text-primary-foreground
          hover:file:bg-primary/90"
      />
    </div>
  );
}