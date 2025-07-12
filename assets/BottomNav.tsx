import { useLocation } from "wouter";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";

interface BottomNavProps {
  onUploadClick: () => void;
  onProfileClick: () => void;
  onMonetizationClick: () => void;
}

export default function BottomNav({ onUploadClick, onProfileClick, onMonetizationClick }: BottomNavProps) {
  const [location, navigate] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/", active: location === "/" },
    { icon: Search, label: "Discover", path: "/discover", active: location === "/discover" },
    { icon: Plus, label: "Upload", path: null, action: onUploadClick },
    { icon: MessageCircle, label: "Inbox", path: "/inbox", action: onMonetizationClick },
    { icon: User, label: "Profile", path: null, action: onProfileClick },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-secondary bg-opacity-95 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.action) {
                item.action();
              } else if (item.path) {
                navigate(item.path);
              }
            }}
            className={`flex flex-col items-center p-2 ${
              item.active ? "text-white" : "text-gray-400"
            } hover:text-white transition-colors`}
          >
            {index === 2 ? (
              <div className="bg-gradient-to-r from-accent-pink to-accent-blue p-3 rounded-xl">
                <item.icon className="w-5 h-5 text-white" />
              </div>
            ) : (
              <>
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{item.label}</span>
                {item.label === "Inbox" && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-accent-pink rounded-full"></div>
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
