import { Image, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { CoreDataMedia } from 'src/model';

import './MediaGallery.css';

interface MediaGalleryProps {

  defaultItem: CoreDataMedia;

  onClose(): void;

}

export const MediaGallery = (props: MediaGalleryProps) => {

  return (
    <Dialog.Root open={Boolean(props.defaultItem)} onOpenChange={props.onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title flex items-center">
            <Image className="h-4 w-4 mr-1.5" /> Media & Documents
          </Dialog.Title>
          <Dialog.Close asChild>
            <button className="dialog-close rounded-full">
              <X className="h-7 w-7 p-1.5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}