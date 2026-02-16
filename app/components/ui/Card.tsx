interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.5)] mx-auto rounded-[0.3rem] border border-[#2A2D3D] pl-[40px] pt-[50px] pr-[41px] pb-[56px]">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
