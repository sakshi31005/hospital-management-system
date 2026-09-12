import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check saved login
  useEffect(() => {
    const savedUser = localStorage.getItem("hms_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("hms_user");
      }
    }

    setLoading(false);
  }, []);

  // LOGIN using backend
  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Invalid email or password",
        };
      }

      setUser(data.user);

      localStorage.setItem(
        "hms_user",
        JSON.stringify(data.user)
      );

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: "Unable to connect to server",
      };
    }
  };

  // REGISTER using backend
  const register = async (
    name,
    email,
    password,
    role = "patient",
    patientDetails = {}
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          ...patientDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Registration failed",
        };
      }

      setUser(data.user);

      localStorage.setItem(
        "hms_user",
        JSON.stringify(data.user)
      );

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: "Unable to connect to server",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hms_user");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";
  const isReceptionist = user?.role === "receptionist";
  const isPatient = user?.role === "patient";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isDoctor,
        isReceptionist,
        isPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}

export default AuthContext;