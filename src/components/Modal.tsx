import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

type ModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  content?: React.ReactNode;
  buttonLabel?: string;
  buttonAction?: () => void;
};

export function Modal_1B({
  isModalOpen,
  title,
  content,
  buttonLabel,
  buttonAction,
}: ModalProps) {
  return (
    <Dialog open={isModalOpen} onClose={() => null} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex h-screen items-center justify-center p-4 text-center">
          <DialogPanel className="relative rounded-lg bg-white text-left shadow-xl">
            <div className="px-4 pb-4 pt-5">
              <DialogTitle as="h1" className="text-3xl font-bold">
                {title}
              </DialogTitle>
              <div>{content}</div>
            </div>
            <div className="px-4 py-3 flex justify-end">
              <button
                type="button"
                onClick={buttonAction}
                className="w-full justify-center rounded-lg px-3 py-2 w-auto text-sm font-bold text-white bg-[#5D5D81]"
              >
                {buttonLabel}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export function Help({ isModalOpen, setIsModalOpen }: ModalProps) {
  return (
    <Dialog open={isModalOpen} onClose={() => null} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex h-screen items-center justify-center p-4 text-center">
          <DialogPanel className="relative rounded-lg bg-white text-left shadow-xl">
            <div className="px-4 pb-4 pt-5">
              <DialogTitle as="h1" className="text-3xl font-bold">
                how to play 🤔
              </DialogTitle>
              <div>
                <li>
                  guess the <strong>movie/series</strong> based on the clip
                  shown.
                </li>
                <li>
                  make sure you have <strong>sounds on.</strong>
                </li>
                <li>
                  you only have <strong>5 guesses</strong> for each clip.
                </li>
                <li>
                  stuck? click <strong>replay</strong> to increase clip duration
                  by <strong>increments of 5s</strong>.
                </li>
                <li>
                  you only have <strong>3 replays</strong> for each clip.
                </li>
                <li>
                  the more replays you use, the{" "}
                  <strong>lesser score you will attain</strong>.
                </li>
              </div>
            </div>
            <div className="px-4 py-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full justify-center rounded-lg px-3 py-2 w-auto text-sm font-bold text-white bg-[#5D5D81]"
              >
                close ❌
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
