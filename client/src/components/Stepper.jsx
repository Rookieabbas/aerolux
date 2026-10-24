import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function Stepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <div className="relative flex items-center justify-between">
        {/* Connecting Background Line */}
        <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-[2px] bg-border -z-0" />

        {/* Connecting Active Gold Line */}
        <motion.div
          className="absolute left-6 top-5 -translate-y-1/2 h-[2px] bg-gold-gradient -z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: (currentStep - 1) / (steps.length - 1),
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ width: 'calc(100% - 48px)' }}
        />

        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          const isAccessible = onStepClick && stepNumber < currentStep;

          return (
            <div
              key={step.title}
              onClick={() => isAccessible && onStepClick(stepNumber)}
              className={`flex flex-col items-center relative z-10 ${
                isAccessible ? 'cursor-pointer group' : ''
              }`}
            >
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  boxShadow: isCurrent
                    ? '0 0 20px rgba(212, 175, 55, 0.5)'
                    : 'none',
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 border-2 ${
                  isCompleted
                    ? 'bg-gold border-gold text-black'
                    : isCurrent
                    ? 'bg-surface border-gold text-gold ring-4 ring-gold/20'
                    : 'bg-surface-card border-border text-muted'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span>0{stepNumber}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <div className="text-center mt-2.5">
                <p
                  className={`text-xs font-medium tracking-wide uppercase transition-colors ${
                    isCurrent
                      ? 'text-gold'
                      : isCompleted
                      ? 'text-white'
                      : 'text-muted-dark'
                  }`}
                >
                  {step.title}
                </p>
                {step.subtitle && (
                  <span className="hidden sm:block text-[10px] text-muted-dark mt-0.5">
                    {step.subtitle}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
