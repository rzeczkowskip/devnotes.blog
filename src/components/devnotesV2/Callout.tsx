import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React, { PropsWithChildren } from 'react';

type CalloutTypeClasses = {
  callout?: string;
  textWrapper?: string;
  icon?: string;
  title?: string;
};

type CalloutType = {
  classes: CalloutTypeClasses;
};

const CalloutTypes: Record<string, CalloutType> = {
  info: {
    classes: {
      callout: 'bg-lead-200 border-lead-800',
    },
  },
} as const;

type CalloutProps = PropsWithChildren<{
  type: keyof typeof CalloutTypes;
  title?: string;
}>;

const Callout: React.FC<CalloutProps> = ({ type, title, children }) => {
  const classNames = CalloutTypes[type].classes || {};

  return (
    <div className={`px-5 border-b-2 rounded flex ${classNames.callout || ''}`}>
      <div className="my-5 mr-5">
        <InformationCircleIcon className={`w-7 h-7 ${classNames.icon || ''}`} />
      </div>
      <div className={`my-auto ${classNames.textWrapper || ''}`}>
        {title && (
          <p className={`font-bold ${classNames.title || ''}`}>{title}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default Callout;
