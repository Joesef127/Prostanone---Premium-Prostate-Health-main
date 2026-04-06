import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { images } from '@/lib';
import { PACKAGES } from '../../lib/constants.ts';
import { useApp } from '../../context/AppContext';
import Button from '../Button';
import { FadeIn, SectionHeader, CheckItem } from './shared';
import { PACKAGE_IMAGES } from '../../lib/data.ts';

const PricingSection: React.FC = () => {
  const { addToCart } = useApp();
  const navigate = useNavigate();

  const handleOrder = (packageId: string) => {
    addToCart(packageId, 1);
    navigate('/summary');
  };

  return (
    <section className="py-24 bg-background" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Choose Your Package"
            title="Start Your Healing Journey Today"
            subtitle="Best results seen after 2 months of consistent use. Bigger packs mean bigger savings."
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {PACKAGES.map((pkg, i) => {
            const isBest = !!pkg.badge;
            const pkgImg = PACKAGE_IMAGES[pkg.containers] ?? images.prostanone;

            return (
              <FadeIn key={pkg.id} delay={i * 0.1}>
                <div
                  className={`relative flex flex-col rounded-3xl overflow-hidden border-2 shadow-sm hover:shadow-xl transition-shadow h-full
                    ${isBest ? 'border-primary' : 'border-gray-200 bg-white'}`}
                >
                  {isBest && (
                    <div className="bg-primary text-white text-xs font-bold tracking-widest uppercase text-center py-2.5">
                      {pkg.badge}
                    </div>
                  )}

                  <div className="flex flex-col grow bg-white p-7">
                    <h3 className="text-xl font-bold text-secondary mb-1">{pkg.name}</h3>
                    <p className="text-text-muted text-sm mb-4">{pkg.description}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary">
                        ₦{pkg.price.toLocaleString()}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice !== pkg.price && (
                        <span className="text-base text-text-light line-through">
                          ₦{pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {pkg.savingsText && (
                      <span className="inline-block bg-success/10 text-success text-xs px-2.5 py-1 rounded-full mb-4">
                        {pkg.savingsText}
                      </span>
                    )}

                    {/* Feature list */}
                    <ul className="space-y-2 mt-2 mb-6 grow">
                      {[
                        `${pkg.containers} Box${pkg.containers > 1 ? 'es' : ''} · ${pkg.containers * 60} Tablets`,
                        pkg.deliveryText,
                        pkg.usageNote,
                      ]
                        .filter(Boolean)
                        .map(item => (
                          <CheckItem key={item} text={item as string} />
                        ))}
                    </ul>

                    <Button
                      fullWidth
                      variant={isBest ? 'primary' : 'outline'}
                      size="md"
                      onClick={() => handleOrder(pkg.id)}
                    >
                      Order Now <ArrowRight size={16} className="ml-1.5" />
                    </Button>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Trust footnotes */}
        <FadeIn className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            '✔ NAFDAC Certified',
            '✔ 100% Natural Herbal Formula',
            '✔ Pay via Bank Transfer or Card',
            '✔ Nationwide Delivery Available',
            '✔ Secure Checkout',
          ].map(item => (
            <span key={item} className="text-xs text-text-muted font-medium">{item}</span>
          ))}
        </FadeIn>
      </div>
    </section>
  );
};

export default PricingSection;
