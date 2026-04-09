import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MoreVertical, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { images } from '@/lib';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { usePackages } from '../../hooks/usePackages';
import { API_BASE } from '../../lib/constants';
import Button from '../Button';
import { FadeIn, SectionHeader, CheckItem } from './shared';
import { PACKAGE_IMAGES } from '../../lib/data.ts';
import PackageEditModal from './PackageEditModal';
import { ProductPackage } from '../../types';

const PricingSection: React.FC = () => {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const { isAdmin, token } = useAuth();
  const { showConfirm } = useModal();
  const { packages, refetch } = usePackages();
  const [editingPkg, setEditingPkg] = useState<ProductPackage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleOrder = (packageId: string) => {
    addToCart(packageId, 1);
    navigate('/summary');
  };

  const openEdit = (pkg: ProductPackage) => { setEditingPkg(pkg); setModalOpen(true); };
  const openAdd  = () => { setEditingPkg(null); setModalOpen(true); };

  const handleDelete = async (pkg: ProductPackage) => {
    setOpenMenuId(null);
    const confirmed = await showConfirm({
      title: 'Delete Package',
      message: `Delete "${pkg.name}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      destructive: true,
    });
    if (!confirmed) return;
    await fetch(`${API_BASE}/api/packages/${pkg.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    refetch();
  };

  return (
    <section className="py-24 bg-background" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-start justify-between gap-4">
            <SectionHeader
              eyebrow="Choose Your Package"
              title="Start Your Healing Journey Today"
              subtitle="Best results seen after 2 months of consistent use. Bigger packs mean bigger savings."
            />
          </div>
        </FadeIn>

        <div className="flex justify-center items-center mb-10">

            {isAdmin && (
              <Button
                variant="outline"
                size="md"
                type="button"
                onClick={openAdd}
                className="shrink-0 mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Add Package
              </Button>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {packages.map((pkg, i) => {
            const isBest = !!pkg.badge;
            const pkgImg = PACKAGE_IMAGES[pkg.containers] ?? images.prostanone;

            return (
              <FadeIn key={pkg.id} delay={i * 0.1}>
                <div
                  className={`relative flex flex-col rounded-3xl overflow-hidden border-2 shadow-sm hover:shadow-xl transition-shadow h-full
                    ${isBest ? 'border-primary' : 'border-gray-200 bg-white'}`}
                >
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === pkg.id ? null : pkg.id)}
                        className="p-1.5 rounded-full bg-white/80 hover:bg-white shadow text-gray-500 hover:text-gray-800 transition-colors"
                        title="Package options"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === pkg.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20">
                          <button
                            onClick={() => { openEdit(pkg); setOpenMenuId(null); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Pencil size={14} /> Edit Package
                          </button>
                          <button
                            onClick={() => handleDelete(pkg)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
                        N{pkg.price.toLocaleString()}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice !== pkg.price && (
                        <span className="text-base text-text-light line-through">
                          N{pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {pkg.savingsText && (
                        <span className="inline-block bg-success/10 text-success text-xs px-2.5 py-1 rounded-full w-fit">
                          {pkg.savingsText}
                        </span>
                      )}
                      <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full w-fit font-medium">
                        Pay on Delivery Available
                      </span>
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-2 mt-2 mb-6 grow">
                      {[
                        `${pkg.containers} Box${pkg.containers > 1 ? 'es' : ''} - ${pkg.containers * 60} Tablets`,
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

        {modalOpen && (
          <PackageEditModal
            pkg={editingPkg}
            onClose={() => setModalOpen(false)}
            onSaved={() => { refetch(); setModalOpen(false); }}
            onDeleted={() => { refetch(); setModalOpen(false); }}
          />
        )}

        {/* Trust footnotes */}
        <FadeIn className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            '✔ NAFDAC Certified',
            '✔ 100% Natural Herbal Formula',
            '✔ Pay on Delivery Available',
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
