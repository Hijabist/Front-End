import { Link } from "react-router-dom";
import { Palette, Instagram, Facebook, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/logo_hijabist.svg"
                alt="Hijabist Logo"
                className="h-6 w-6"
              />
              <span className="font-semibold text-pink-500">Hijabist</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Platform analisis warna hijab yang membantu Anda menemukan gaya
              hijab yang sempurna sesuai bentuk wajah.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-rose-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/analysis"
                  className="text-muted-foreground hover:text-rose-400 transition-colors"
                >
                  Color Analysis
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-muted-foreground hover:text-rose-400 transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-rose-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Hijabist. All rights reserved. Made with ❤️ for hijabi women.
          </p>
        </div>
      </div>
    </footer>
  );
}
