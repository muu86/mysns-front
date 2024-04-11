import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FileType } from '@/types/definitions';
import Image from 'next/image';

export default function FileCarousel({ files }: { files: FileType[] }) {
  return (
    <Carousel className="relative">
      <CarouselContent>
        {files.map((f, i) => (
          <CarouselItem key={i} className="relative bg-neutral-900 flex items-center w-[470px] h-[580px] object-fill">
            <Image width={600} height={600} src={f.url.md} alt="post-image" draggable={false} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2" />
      <CarouselNext className="absolute right-2" />
    </Carousel>
  );
}
