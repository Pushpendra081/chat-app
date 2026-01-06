import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================
     CHECK AUTH ON REFRESH
  ====================== */
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log("Auth check failed");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     LOGIN
  ====================== */
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${data.token}`;

        setAuthUser(data.userData);
        connectSocket(data.userData);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* =====================
     LOGOUT
  ====================== */
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];

    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);

    socket?.disconnect();
    toast.success("Logged out successfully");
  };

  /* =====================
     UPDATE PROFILE
  ====================== */
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put(
        "/api/auth/update-profile",
        body
      );

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* =====================
     SOCKET CONNECT
  ====================== */
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  /* =====================
     INIT AUTH ON LOAD
  ====================== */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${storedToken}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        onlineUsers,
        socket,
        loading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};






// import { createContext, useEffect, useState } from "react";
// import axios from "axios"
// import { toast } from "react-hot-toast"
// import { io } from "socket.io-client"


// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.baseURL = backendUrl

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//     const [token, setToken] = useState(localStorage.getItem("token"));
//     const [authUser, setAuthUser] = useState(null);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const [socket, setSocket] = useState(null);

//     // Check if user is authenticated and if so, set the user data and connect the socket
//     const checkAuth = async () => {

//         try {
//             const { data } = await axios.get("/api/auth/check");
//             if (data.success) {
//                 setAuthUser(data.user)
//                 connectSocket(data.user)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     // Login fuction to handle user authenticatin and socket connection

//     const login = async (state, credentials) => {
//         try {
//             const { data } = await axios.post(`/api/auth/${state}`, credentials);
//             if (data.success) {
//                 setAuthUser(data.userData);
//                 connectSocket(data.userData);
//                 axios.defaults.headers.common["token"] = data.token;
//                 setToken(data.token);
//                 localStorage.setItem("token", data.token)
//                 toast.success(data.message)
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     }

//     // Logout function to handle user logout and socket disconnection

//     const logout = async () => {
//         localStorage.removeItem("token");
//         setToken(null);
//         setAuthUser(null);
//         setOnlineUsers([]);
//         axios.defaults.headers.common["token"] = null;
//         toast.success("Logged out successfully");
//         socket.disconnect();
//     }

//     // Update profile function to handle user profile updates    

//     const updateProfile = async (body) => {
//         try {
//             const { data } = await axios.put("/api/auth/update-profile", body, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             if (data.success) {
//                 setAuthUser(data.user);
//                 toast.success("Profile updated successfully")
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     }

//     // Connect socket function to handle socket connection and online users updates
//     const connectSocket = (userData) => {
//         if (!userData || socket?.connected) return;
//         const newSocket = io(backendUrl, {
//             query: {
//                 userId: userData._id,
//             }
//         });
//         newSocket.connect();
//         setSocket(newSocket);

//         newSocket.on("getOnlineUsers", (userIds) => {
//             setOnlineUsers(userIds);
//         })
//     }

//     useEffect(() => {
//         if (token) {
//             axios.defaults.headers.common["token"] = token;
//         }
//         checkAuth();
//     }, [])

//     const value = {
//         axios,
//         authUser,
//         onlineUsers,
//         socket,
//         login,
//         logout,
//         updateProfile
//     }

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     )
// }