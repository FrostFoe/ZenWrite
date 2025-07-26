
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FilePlus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const icons: { [key: string]: React.ElementType } = {
  FilePlus,
  Upload,
};

interface FabAction {
  label: string;
  icon: string;
  action: () => void;
}

interface ExpandableFabProps {
  actions: FabAction[];
}

export function ExpandableFab({ actions }: ExpandableFabProps) {
  const [isOpen, setIsOpen] = useState(false);

  const staggerVariants = {
    open: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: 1,
      },
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };
  
  const mainButtonVariants = {
    open: { rotate: 45 },
    closed: { rotate: 0 }
  }

  return (
    <div className="fixed bottom-28 right-6 lg:bottom-8 lg:right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={staggerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col items-end space-y-4 mb-4"
          >
            {actions.map((action) => {
              const IconComponent = icons[action.icon];
              return (
                <motion.div
                  key={action.label}
                  variants={itemVariants}
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="bg-card text-card-foreground text-sm font-medium py-1 px-3 rounded-md shadow-sm border">
                    {action.label}
                  </span>
                  <Button
                    className="h-12 w-12 rounded-full shadow-md"
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                        action.action();
                        setIsOpen(false);
                    }}
                  >
                    {IconComponent && <IconComponent className="h-6 w-6" />}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.95 }}
      >
        <Button
            className={cn(
                "h-16 w-16 rounded-full shadow-2xl transition-colors duration-300",
                isOpen ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
            )}
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close actions" : "Open actions"}
        >
            <motion.div
                variants={mainButtonVariants}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3 }}
            >
                <Plus className="h-8 w-8" />
            </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
