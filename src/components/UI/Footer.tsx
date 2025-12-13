export const Footer = () => {
    return (
        <footer className="py-8 px-6 md:px-20 bg-charcoal text-cream/40 text-sm uppercase tracking-wide flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                &copy; {new Date().getFullYear()} Venkat Reddy (ShivaTandav). All rights reserved.
            </div>
            <div className="flex gap-8">
                <a href="#" className="hover:text-cream transition-colors">Privacy</a>
                <a href="#" className="hover:text-cream transition-colors">Terms</a>
            </div>
        </footer>
    );
};
