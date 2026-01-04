const VisionAndMission = () => {
  return (
    <section className="py-12 px-6 relative bg-gradient-to-b from-secondary/5 to-background">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide">
            OUR CORE VALUES
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">Guided by Purpose</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our commitment to blending spiritual wisdom with modern scientific understanding.
          </p>
        </div>

        {/* TWO BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* VISION BOX */}
          <div className="glass-panel p-10 rounded-3xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group border-t-4 border-blue-500">
            <div className="w-16 h-16 mb-6 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img src="/mission.png" alt="Vision" className="w-10 h-10 object-contain brightness-0 opacity-80" style={{ filter: 'invert(37%) sepia(87%) saturate(2222%) hue-rotate(212deg) brightness(97%) contrast(92%)' }} />
            </div>

            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed text-lg text-justify">
              To provide tangible and creative educational experiences within the institution
              to realise the beauty of divine self through vibrant spiritual orientation; to develop
              a quest for scientific and explorative approach to material success so as to preserve
              and sustain the harmony between Man and Nature.
            </p>
          </div>

          {/* MISSION BOX */}
          <div className="glass-panel p-10 rounded-3xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group border-t-4 border-indigo-500">
            <div className="w-16 h-16 mb-6 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img src="/vision.png" alt="Mission" className="w-10 h-10 object-contain brightness-0 opacity-80" style={{ filter: 'invert(27%) sepia(57%) saturate(3222%) hue-rotate(232deg) brightness(87%) contrast(92%)' }} />
            </div>

            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed text-lg text-justify">
              Imparting harmony and integration of personality by developing meditative
              awareness of life through inward exploration to know oneself and simultaneously
              explore and understand scientifically the material world so as to create and experience
              the beauty of life both within and without.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VisionAndMission;
