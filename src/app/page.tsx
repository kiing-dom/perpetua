import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="dark:text-white text-black">Welcome to Perpetua</h1>
      <p className="text-black">This is where the development begins</p>
    </div>
  );
}
