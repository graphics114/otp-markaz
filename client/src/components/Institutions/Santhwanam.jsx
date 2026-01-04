const Santhwanam = () => {
  return ( <>
    <div className="bg-background pb-6">
      <div className="max-w-6xl mx-auto px-4 pt-10">

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10
                        px-6 py-8 glass rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start">
            <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
              Santhwana Kendram
            </h1>

            <div className="w-full max-w-sm overflow-hidden rounded-md">
                <img src="/santh.png" alt="Santhwana-Kendram"
              className="w-full object-cover transition-transform duration-300 ease-in-out
                hover:scale-110"
                />
            </div>
            
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    Compassion in Action
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2"> 
                    Santhwana Kendram is a permanent charitable initiative dedicated to identifying 
                    the underprivileged and the ailing, and providing them with compassionate care and 
                    medical assistance. Through systematic surveys conducted in rural areas, the centre 
                    ensures that deserving patients receive timely treatment and essential support.

                    In addition to direct care, Santhwana Kendram actively engages in a range of 
                    humanitarian activities, including medical camps, free distribution of medicines, 
                    wheelchair distribution, and other welfare services aimed at improving the quality 
                    of life of those in need.
                </p>
            </span>
          </div>

        </div>

      </div>
    </div>
    </>
  );
};


export default Santhwanam;