type EditorialPhotoProps = {
  image: string;
  alt: string;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  priority?: boolean;
  sizes?: string;
};

export function EditorialPhoto({ image, alt, imageSrc, imageWidth = 1280, imageHeight = 788, priority = false, sizes = "(max-width: 700px) calc(100vw - 40px), 48vw" }: EditorialPhotoProps) {
  if (imageSrc) {
    return <picture className="editorial-photo">
      <img src={imageSrc} width={imageWidth} height={imageHeight} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
    </picture>;
  }

  const base = `/images/gardens-by-the-bay/optimized/${image}`;
  return <picture className="editorial-photo">
    <source type="image/webp" srcSet={`${base}-720.webp 720w, ${base}-1440.webp 1440w`} sizes={sizes} />
    <img src={`${base}-720.jpg`} srcSet={`${base}-720.jpg 720w, ${base}-1440.jpg 1440w`} sizes={sizes} width={720} height={900} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
  </picture>;
}
