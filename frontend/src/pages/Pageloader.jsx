export default function PageLoader({ compact = false }) {
  return (
    <div
      className={`${
        compact
          ? "relative min-h-[16rem] w-full"
          : "fixed inset-0 z-[9999] min-h-screen w-screen"
      } flex items-center justify-center bg-white px-6 select-none`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Top hairline progress bar (Vercel / GitHub style) */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2.5px] overflow-hidden bg-slate-100">
        <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-top-stream" />
      </div>

      {/* Centered minimalist hairline loading bar */}
      <div className="relative h-[3px] w-36 sm:w-44 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-center-stream" />
      </div>

      <style>{`
        @keyframes top-stream {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes center-stream {
          0% {
            transform: translateX(-120%);
            width: 35%;
          }
          50% {
            transform: translateX(80%);
            width: 55%;
          }
          100% {
            transform: translateX(260%);
            width: 35%;
          }
        }
        .animate-top-stream {
          animation: top-stream 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-center-stream {
          animation: center-stream 1.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
      `}</style>
    </div>
  );
}
