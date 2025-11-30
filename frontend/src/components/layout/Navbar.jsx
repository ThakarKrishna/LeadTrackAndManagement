import React from "react";
import { useTheme } from "../../providers/ThemeProvider.jsx";
import { useAuth } from "../../providers/AuthProvider.jsx";
import { Button } from "../ui/Button.jsx";

export const Navbar = () => {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="font-semibold">Lead Tracking & Management</div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={toggle}>
          {theme === "dark" ? "Light" : "Dark"}
        </Button>
        {user ? (
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        ) : null}
      </div>
    </header>
  );
};

