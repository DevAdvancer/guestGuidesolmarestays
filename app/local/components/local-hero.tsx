export function LocalHero() {
  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px] md:min-h-[400px]">
      {/* Background: Full-width lifestyle image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero.jpg?v=3')", // Local Lifestyle Image
          backgroundColor: "#8BABA5", // Fallback
        }}
      >
        <div className="absolute inset-0 bg-black/10" /> {/* Subtle dim */}
      </div>

      {/* Overlay: Floating White Box (Centered Bottom) */}
      <div className="absolute bottom-[-30px] left-0 right-0 flex justify-center px-4 z-10">
        <div className="bg-white rounded-t-2xl rounded-b-xl shadow-lg px-6 py-4 md:px-12 md:py-6 w-[90%] md:w-full max-w-lg text-center">
          {/* Text: "Live Like a Local" (Serif, #556D78) */}
          <h1 className="font-serif text-2xl md:text-4xl font-bold text-[#556D78] tracking-tight">
            Live Like a Local
          </h1>
        </div>
      </div>
    </section>
  );
}
