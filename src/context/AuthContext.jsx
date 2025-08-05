import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const API_URL = "http://localhost:5000/api/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  

  const signup = async (userData) => {
    return axios.post(`${API_URL}/signup`, userData);
  };

  const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);

    if (response.data && response.data.token) {
      const { token, user } = response.data;

      console.log("USER OBJECT FROM BACKEND:", user);

      setToken(token);
      setUser(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return response.data;
  };

  // Logout function

  const logout = () => {
    console.log("[AuthContext] Logging out user.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
  };

  const manuallyUpdateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, updatedData);

      if (response.data && response.data.user) {
        
        manuallyUpdateUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to update profile:", error);

      throw error;
    }
  };
  const changePassword = async (passwordData) => {
    return axios.put(`${API_URL}/change-password`, passwordData);
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    changePassword,
    manuallyUpdateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
