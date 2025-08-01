const SkeletonCard = () => {
  return (
    <div className="group relative bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative overflow-hidden">
        <div className="w-full h-56 bg-gray-200 animate-pulse"></div>
      </div>
      <div className="p-5">
        <div className="mb-3">
          <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <div className="h-4 w-24 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
