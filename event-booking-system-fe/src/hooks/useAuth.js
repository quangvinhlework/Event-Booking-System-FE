import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  //Thich thi them context vao day de tra ve nhieu gia tri hon ehehehe

  return {
    ...context
  };
};