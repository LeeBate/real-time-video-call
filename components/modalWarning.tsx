import Image from "next/image";
import WarningIcon from "@/public/icons/icons-warning.png";

interface iModalWarning {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

const ModalWarning = ({
  isOpen,
  onClose,
  title = "พบข้อผิดพลาด",
  description = "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง",
  buttonText = "รับทราบ",
}: iModalWarning) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-sm transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all animate-fadeIn overflow-visible">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex h-20 w-20 items-center justify-center rounded-full bg-white ring-white">
          <Image
            src={WarningIcon}
            alt="Warning Icon"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        <div className="flex flex-col items-center justify-center text-center mt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>

          <div className="mt-2">
            <p className="text-sm text-gray-500">{description}</p>
          </div>

          <div className="mt-6 w-full">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors shadow-sm"
              onClick={onClose}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWarning;
