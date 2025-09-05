import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  alt, 
  className 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted rounded-lg aspect-video",
        className
      )}>
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Main Image Display */}
      <div className="relative aspect-video rounded-lg overflow-hidden group">
        <img
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 glass-button opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 glass-button opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 glass-button opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
            <div className="relative">
              <img
                src={images[currentIndex]}
                alt={`${alt} - Image ${currentIndex + 1}`}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
              
              {/* Zoom Navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-button"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-button"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 glass-button px-2 py-1 rounded-md text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all",
                currentIndex === index 
                  ? "border-primary ring-2 ring-primary/50" 
                  : "border-transparent hover:border-muted"
              )}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator (Alternative for many images) */}
      {images.length > 8 && (
        <div className="flex justify-center gap-1 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentIndex === index 
                  ? "bg-primary" 
                  : "bg-muted hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};