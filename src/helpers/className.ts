import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const className = (...args: ClassValue[]) => twMerge(clsx(...args));

export default className;
