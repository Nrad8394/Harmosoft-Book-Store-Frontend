import Image from 'next/image';

interface CardProps {
  image: string;
  title: string;
  description: string;
}

export default function Card({ image, title, description }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-101 hover:bg-green-100 hover:shadow-lg duration-500 w-full h-full">
      {/* Image Container */}
      <div className="relative w-full h-40 md:h-48 lg:h-56">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-t-lg"
        />
      </div>
      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-full">
        <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap overflow-hidden text-ellipsis mt-2 flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
}
