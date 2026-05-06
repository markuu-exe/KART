import SkeletonCard from './SkeletonCard';

export default function SkeletonList({ count = 3, className = 'flex flex-col gap-3', cardClassName = '', cardProps = {} }) {
  return (
    <div className={className} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={`skeleton-${index}`} className={cardClassName} {...cardProps} />
      ))}
    </div>
  );
}
