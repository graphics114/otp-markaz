const Moc = () => {
  return (
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10
                        px-6 py-8 rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start md:hidden">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
                  Markaz Oriental College
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/MOC.jpg" alt="Moc"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110 border border-border"
                    />
                </div>        
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    Exploring the Depths of the Arabic Language
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2"> 
                    Markaz Oriental Arabic College is an institution that began its academic journey 
                    in the 200-2005 academic year under the Ottappalam Markazul Isha'athil Islamiyya 
                    Trust. It is a University of Calicut affiliated Arabic college functioning under 
                    the guidance of the traditional Sunni scholars in Palakkad district.

                    The college currently offers two courses approved by 
                    the University of Calicut: <br />

                    1. Afsal-ul-Ulama Preliminarybr <br />

                    2. B.A. Afsal-ul-Ulama
                </p>
            </span>
          </div>

          {/* Image + Title */}
          <div className="flex-col items-start hidden md:flex">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900">
                  Markaz Oriental College
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/MOC.jpg" alt="Moc"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110 border border-border"
                    />
                </div>        
          </div>

        </div>
      </div>
  );
};


export default Moc;