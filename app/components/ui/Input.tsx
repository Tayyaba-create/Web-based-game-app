import { cn } from "@/app/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-medium text-white">{label}</label>
      )}
      <input
        {...props}
        className={cn(
          "px-[5px] pr-[21px] pt-[15px] pb-[15px] bg-[#0F111A] rounded-[0.3rem] focus:outline-none transition-all duration-300 text-xl caret-[#7B61FF]",
          className,
          // enforce default border color and focus styles after any page classes so they win
          "border-2 border-[#2A2D3D] focus:border-[#7B61FF] focus:ring-2 focus:ring-[#7B61FF] focus:ring-opacity-20",
          // force input text color to white last so it wins over any passed classes
          "text-white placeholder-gray-400"
        )}
        style={{ ...(props.style as React.CSSProperties), color: "#FFFFFF" }}
      />
    </div>
  );
}
