const DonationSection = () => {
    return (
        <section className="py-2 mb-4">
            <div className="glass-panel animate-fade-in">
                <div className="max-w-2xl mx-auto text-xs md:text-lg text-center">
                    <h2 className="text-3xl font-bold ">Support Our Cause</h2>
                    <p className="mb-8 mt-2 text-muted-foreground">
                        Your generous donations help us continue our mission and make a positive impact in the community.
                    </p>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-center
                    gap-6 md:gap-10">
                  {/* LEFT SIDE – QR IMAGE */}
                  <div className="flex-shrink-0 w-60 h-75 md:w-41 md:h-41 object-contain">
                    <img src="/gpayLogo.png" alt="UPI Payments"
                        className=""/>
                  </div>

                  {/* RIGHT SIDE – BANK DETAILS */}
                  <div className="text-center md:text-left max-w-md">
                        <h3 className="text-xl font-semibold mb-2">
                          Bank Details
                        </h3>
        
                        <p className="text-sm md:text-base text-muted-foreground">
                          Account Name: <span className="font-medium text-foreground">Secratary Ottapalam Markaz</span>
                        </p>
        
                        <p className="text-sm md:text-base text-muted-foreground">
                          Account Number: <span className="font-medium text-foreground">14310200011523</span>
                        </p>
        
                        <p className="text-sm md:text-base text-muted-foreground">
                          IFSC Code: <span className="font-medium text-foreground">FDRL0001431</span>
                        </p>
        
                        <p className="text-sm md:text-base text-muted-foreground">
                          Bank: <span className="font-medium text-foreground">Federal Bank Ottapalam</span>
                        </p>

                        <p className="text-sm md:text-base text-muted-foreground">
                          GPay Number: <span className="font-medium text-foreground">994 7111 486</span>
                        </p>
                  </div>
                </div>

            </div>
        </section>
    );
}

export default DonationSection;