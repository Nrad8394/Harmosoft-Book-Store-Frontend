import Image from 'next/image';

interface SelectedItemCardProps {
  image: string;
  title: string;
  price: number;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
  onClick: () => void;  // Add the onClick prop
}

export default function SelectedItemCard({
  image,
  title,
  price,
  quantity,
  onQuantityChange,
  onRemove,
  onClick,  // Destructure the onClick prop
}: SelectedItemCardProps) {
  return (
    <div
      className="relative bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 cursor-pointer transition-transform transform hover:scale-100 hover:shadow-xl"
      onClick={onClick}  // Make the card clickable
    >
      {/* Image Container */}
      <div className="relative w-32 h-32 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-lg">
        <Image src={image} alt={title} layout="fill" objectFit="cover" className="rounded-lg" />
      </div>

      {/* Content */}
      <div className="flex-grow text-center md:text-left">
        <h4 className="text-base font-medium text-gray-900 mb-2">{title}</h4>
        <p className="text-lg text-gray-600 mb-4">Ksh. {price.toFixed(2)}</p>
        <div className="mt-2 flex items-center justify-center md:justify-start space-x-2">
          <label className="text-sm font-medium text-gray-700">Quantity:</label>
          <div className="flex items-center space-x-2 bg-gray-200 rounded-full p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();  // Prevent triggering the onClick event
                onQuantityChange(quantity - 1);
              }}
              disabled={quantity <= 1}
              className={`bg-gray-200 hover:bg-green-500 text-gray-600 hover:text-white font-semibold py-1 px-3 rounded-full focus:outline-none transition-colors duration-200 ${
                quantity <= 1 ? 'cursor-not-allowed' : ''
              }`}
            >
              -
            </button>
            <span className="text-sm font-semibold">{quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();  // Prevent triggering the onClick event
                onQuantityChange(quantity + 1);
              }}
              className="bg-gray-200 hover:bg-green-500 text-gray-600 hover:text-white font-semibold py-1 px-3 rounded-full focus:outline-none transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        aria-label={`Remove ${title}`} // Provide accessible text
        type="button" // Set type to "button" to prevent form submission
        onClick={(e) => {
          e.stopPropagation();  // Prevent triggering the onClick event when removing
          onRemove();
        }}
        className="absolute top-0 right-2 text-gray-400 hover:text-red-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
