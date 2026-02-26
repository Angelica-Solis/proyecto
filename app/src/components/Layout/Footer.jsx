export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full h-14 bg-black/80 backdrop-blur-sm text-white flex items-center justify-center px-4 py-3 shadow-2xl border-t border-white/10">
      <div className="w-full max-w-7xl text-center">
        {/* Usamos tracking-widest y uppercase para un look de marca de lujo */}
        <p className="text-[10px] md:text-xs font-light tracking-[0.3em] uppercase opacity-80">
          Luxury Auto Auctions <span className="mx-2">|</span> ISW-613
        </p>
        <p className="text-[9px] font-extralight tracking-widest text-white/40 mt-1">
          &copy; {new Date().getFullYear()} EXCLUSIVE MOTORS GROUP
        </p>
      </div>
    </footer>
  );
}