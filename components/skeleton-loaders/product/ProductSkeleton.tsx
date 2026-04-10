import React from 'react';
import ProductHeroSkeleton     from './ProductHeroSkeleton';
import TrustBarSkeleton        from './TrustBarSkeleton';
import ProblemSectionSkeleton  from './ProblemSectionSkeleton';
import BenefitsSkeleton        from './BenefitsSkeleton';
import IngredientsSkeleton     from './IngredientsSkeleton';
import ProductPricingSkeleton  from './ProductPricingSkeleton';

/** Full-page skeleton for the Product page — used as React.lazy Suspense fallback */
const ProductSkeleton: React.FC = () => (
  <div className="overflow-x-hidden">
    <ProductHeroSkeleton />
    <TrustBarSkeleton />
    <ProblemSectionSkeleton />
    <BenefitsSkeleton />
    <IngredientsSkeleton />
    <ProductPricingSkeleton />
  </div>
);

export default ProductSkeleton;
