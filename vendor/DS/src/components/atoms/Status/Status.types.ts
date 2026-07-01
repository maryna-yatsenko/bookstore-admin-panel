export type StatusStatus = 'success' | 'warning' | 'error' | 'disabled';
export type StatusSize   = 'small' | 'big';

export interface StatusProps {
  status?:    StatusStatus;
  size?:      StatusSize;
  labelText?: string;
  className?: string;
}
