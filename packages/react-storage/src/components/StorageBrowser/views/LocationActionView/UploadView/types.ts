import {
  ActionViewComponent,
  ActionViewProps,
  ActionViewState,
} from '../types';

export interface UploadViewState extends ActionViewState<File> {
  disableCancel: boolean;
  disableClose: boolean;
  disableStart: boolean;
  isOverwriteDisabled: boolean;
  isSelectFilesDisabled: boolean;
  preventOverwrite: boolean;
  onDropFiles: (files?: File[]) => void;
  onSelectFiles: (type?: 'FILE' | 'FOLDER') => void;
  onToggleOverwrite: () => void;
}

export interface UploadViewProps
  extends ActionViewProps,
    Partial<UploadViewState> {}

export interface UploadViewComponent
  extends ActionViewComponent<UploadViewProps> {}
