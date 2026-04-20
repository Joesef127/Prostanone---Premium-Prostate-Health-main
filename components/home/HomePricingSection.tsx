import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle, Clock, ArrowRight, MoreVertical, Pencil, Trash2, PlusCircle } from 'lucide-react';
import Button from '../Button';
import { SMALL_PRINT } from '../../lib/constants';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { usePackages } from '../../hooks/usePackages';
import { API_BASE } from '../../lib/constants';
import { images } from '../../lib';
import PackageEditModal from '../product-page/PackageEditModal';
import { ProductPackage } from '../../types';

const HomePricingSection: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const { isAdmin, token } = useAuth();
  const { showConfirm } = useModal();
  const { packages, refetch } = usePackages();
  const [editingPkg, setEditingPkg] = useState<ProductPackage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handlePackageSelect = (pkgId: string) => {
    addToCart(pkgId);
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
    <section id="pricing" className="py-24 bg-linear-to-b from-color-background to-color-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 tracking-tight">Choose Your Package</h2>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">Simple transparent pricing. Experience the power of nature with guaranteed results.</p>

        <div className="flex justify-center mt-6">
          {isAdmin && (
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Add Package
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-8 pb-12 px-4 md:px-8 max-w-350 mx-auto lg:items-stretch">

        {/* Static Hero Image Card */}
        <div className="relative shrink-0 w-full lg:w-112.5 rounded-3xl overflow-hidden shadow-2xl group border border-gray-200 lg:sticky lg:top-8 h-100 lg:h-auto min-h-125">
          <img src={images.prostanone_home} alt="Prostanone Premium Product" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-8">
            <div className="bg-accent text-primary text-xs font-bold uppercase py-1 px-3 rounded-full inline-block mb-3 self-start">Premium Quality</div>
            <h3 className="text-3xl font-bold text-white mb-2">100% Herbal</h3>
            <p className="text-white/90 text-sm">Manufactured in GMP-certified facilities using only the finest natural extracts.</p>
          </div>
        </div>

        {/* Scrolling Packages Wrapper */}
        <div className="grow flex flex-col w-full min-w-0">
          {/* Drag/Swipe Hint */}
          <div className="flex justify-center mb-2">
            <motion.div
              animate={{ x: [-8, 8, -8] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2 text-primary font-medium text-sm bg-green-50/80 backdrop-blur px-4 py-1.5 rounded-full border border-green-200 shadow-sm"
            >
              <span>Swipe to compare packages</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Scrolling Packages */}
          <div className="flex overflow-x-auto gap-4 pb-12 snap-x snap-mandatory grow items-stretch px-4 pt-8 no-scrollbar">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative shrink-0 w-72 sm:w-80 lg:w-88 min-h-125 p-6 sm:p-8 rounded-3xl flex flex-col snap-center border transition-all duration-300 hover:shadow-2xl ${
                  pkg.id === 'option-b'
                    ? 'border-primary bg-primary text-white shadow-xl scale-[1.02] z-10 mx-2'
                    : 'border-gray-200 bg-white'
                }`}
              >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-20">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === pkg.id ? null : pkg.id); }}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === pkg.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-xl py-1 min-w-[140px] z-30">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(pkg); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-primary" /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(pkg); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                {pkg.id === 'option-b' && (
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  </div>
                )}
                {pkg.badge && (
                  <div className={`absolute -top-4 w-10/12 left-1/2 transform -translate-x-1/2 font-bold text-xs py-1.5 px-4 rounded-b-xl uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm ${pkg.id === 'option-b' ? 'bg-accent text-primary' : 'bg-gray-100 text-gray-600'}`}>
                    <ShieldCheck className="w-3 h-3" /> {pkg.badge}
                  </div>
                )}

                <div className="mt-4 relative z-10">
                  <h3 className={`text-xl font-bold mb-1 ${pkg.id === 'option-b' ? 'text-white' : 'text-text'}`}>{pkg.name}</h3>
                  {pkg.subtitle && <p className={`text-sm font-semibold mb-2 ${pkg.id === 'option-b' ? 'text-accent' : 'text-primary'}`}>{pkg.subtitle}</p>}
                </div>

                <div className="flex flex-col items-start gap-1 mb-6">
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <span className={`text-sm line-through ${pkg.id === 'option-b' ? 'text-white/60' : 'text-gray-400'}`}>Was ₦{pkg.originalPrice.toLocaleString()}</span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-extrabold tracking-tight ${pkg.id === 'option-b' ? 'text-white' : 'text-primary'}`}>₦{pkg.price.toLocaleString()}</span>
                  </div>
                  {pkg.savingsText && (
                    <span className={`text-sm font-bold px-2 py-1 rounded-md mt-2 ${pkg.id === 'option-b' ? 'bg-white/10 text-accent' : 'bg-green-50 text-green-700'}`}>
                      {pkg.savingsText}
                    </span>
                  )}
                  <span className="mt-2 inline-block bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full w-fit font-medium">
                        Pay on Delivery Available
                      </span>
                </div>

                <p className={`text-sm mb-4 pb-4 border-b grow ${pkg.id === 'option-b' ? 'text-white/80 border-white/10' : 'text-text-muted border-gray-100'}`}>
                  {pkg.description}
                  {pkg.recommendedFor && <><br /><br /><strong className={pkg.id === 'option-b' ? 'text-white' : 'text-gray-800'}>{pkg.recommendedFor}</strong></>}
                  
                </p>

                {pkg.usageNote && (
                  <div className={`mb-6 flex items-center gap-2 p-3 rounded-xl text-xs font-bold leading-tight ${pkg.id === 'option-b' ? 'bg-white/10 text-accent' : 'bg-accent/10 text-primary'}`}>
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{pkg.usageNote}</span>
                  </div>
                )}

                <ul className="space-y-4 mb-8 text-sm">
                  <li className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${pkg.id === 'option-b' ? 'bg-white/10 text-accent' : 'bg-green-50 text-green-500'}`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className={pkg.id === 'option-b' ? 'text-white/90' : 'text-gray-600'}>{pkg.containers} Herbal Packs</span>
                  </li>
                  {pkg.deliveryText && (
                    <li className="flex items-center gap-3">
                      <div className={`p-1 rounded-full ${pkg.id === 'option-b' ? 'bg-white/10 text-accent' : 'bg-green-50 text-green-500'}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className={pkg.id === 'option-b' ? 'text-white/90' : 'text-gray-600'}>{pkg.deliveryText}</span>
                    </li>
                  )}
                </ul>

                <Button
                  size="sm"
                  variant={pkg.id === 'option-b' ? 'secondary' : 'outline'}
                  className={pkg.id === 'option-b' ? 'w-full shadow-lg shadow-accent/20 text-primary hover:bg-white hover:text-primary transition-colors relative z-10' : 'w-full border-gray-300 relative z-10'}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  Select Package
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-2.5 sm:mx-auto bg-color-background backdrop-blur border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 text-lg">
          <span className="text-2xl">📌</span> Everything You Need To Know
        </h4>
        <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
          {SMALL_PRINT.map((text, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
              <span className="leading-relaxed">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <PackageEditModal
          pkg={editingPkg}
          onClose={() => setModalOpen(false)}
          onSaved={() => { refetch(); setModalOpen(false); }}
          onDeleted={() => { refetch(); setModalOpen(false); }}
        />
      )}
    </section>
  );
};

export default HomePricingSection;
