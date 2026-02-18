import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/919873816127?text=Hi%2C%20I%20am%20interested%20in%20Angel%20Cables%20products.%20Please%20share%20details.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-button"
      className="fixed bottom-24 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} className="fill-white" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-slate-900 text-sm font-semibold px-4 py-2 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}
