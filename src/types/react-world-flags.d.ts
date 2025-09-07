declare module 'react-world-flags' {
  import { ComponentType } from 'react';

  export interface FlagProps {
    code: string;
    className?: string;
    style?: React.CSSProperties;
    height?: number | string;
    width?: number | string;
    fallback?: ComponentType | null;
  }

  const Flag: ComponentType<FlagProps>;
  export default Flag;
}
