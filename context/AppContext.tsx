import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CartItem, QuizResult, QuizSeverity } from '../types';

interface AppContextType {
  cart: CartItem[];
  addToCart: (packageId: string, quantity?: number) => void;
  removeFromCart: (packageId: string) => void;
  updateQuantity: (packageId: string, quantity: number) => void;
  clearCart: () => void;
  quizResult: QuizResult | null;
  setQuizResult: (result: QuizResult) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const addToCart = useCallback((packageId: string, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.packageId === packageId);
      if (existing) {
        return prev.map(item =>
          item.packageId === packageId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { packageId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((packageId: string) => {
    setCart(prev => prev.filter(item => item.packageId !== packageId));
  }, []);

  const updateQuantity = useCallback((packageId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item =>
      item.packageId === packageId ? { ...item, quantity } : item
    ));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, quizResult, setQuizResult }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};