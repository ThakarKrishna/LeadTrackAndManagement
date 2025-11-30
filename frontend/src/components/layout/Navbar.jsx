import React from "react";
import { useTheme } from "../../providers/ThemeProvider.jsx";
import { useAuth } from "../../providers/AuthProvider.jsx";
import { Button } from "../ui/Button.jsx";
import { Sun, Moon, LogOut } from "lucide-react";

export const Navbar = () => {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="font-semibold">Lead Tracking & Management</div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={toggle}
          className="h-10 w-10 p-0"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        {user ? (
          <Button variant="ghost" onClick={logout} title="Logout">
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        ) : null}
      </div>
    </header>
  );
};

