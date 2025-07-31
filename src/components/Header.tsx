import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AuthModal from "./auth/AuthModal";

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const navItems = [
    { label: "Competitions", href: "/competitions" },
    { label: "Winners", href: "/winners" },
    { label: "Rules", href: "/rules" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex flex-col items-start">
              <div className="text-2xl font-display font-bold text-primary tracking-tight">
                MAXIM
              </div>
              <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">
                CoverGirl
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-accent transition-smooth relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAuthClick('login')}
              className="text-foreground hover:text-accent"
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => handleAuthClick('register')}
              className="bg-gradient-competition text-competition-foreground hover:opacity-90 transition-smooth"
            >
              Register
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="flex flex-col">
                    <div className="text-xl font-display font-bold text-primary">
                      MAXIM
                    </div>
                    <div className="text-xs text-muted-foreground">
                      CoverGirl
                    </div>
                  </div>
                </div>

                <nav className="flex-1 py-6">
                  <ul className="space-y-4">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="block text-lg font-medium text-foreground hover:text-accent transition-smooth py-2"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="border-t border-border pt-6 space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => handleAuthClick('login')}
                    className="w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('register')}
                    className="w-full bg-gradient-competition text-competition-foreground"
                  >
                    Register
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </>
  );
};

export default Header;