import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/loginFormModal";
import ProfileTable from "./components/ProfileTable";
// YENİ EKLEDİĞİMİZ SATIR:
import ProductTable from "./components/productTable"; 

function App() {
  const checkAuth = () => !!localStorage.getItem("token");

  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={checkAuth() ? <Navigate to="/profiletable" /> : <LoginForm />} 
          />
          <Route 
            path="/profiletable" 
            element={checkAuth() ? <ProfileTable /> : <Navigate to="/" />} 
          />
          
          {/* Ürünler sayfası rotası */}
          <Route 
            path="/producttable" 
            element={checkAuth() ? <ProductTable /> : <Navigate to="/" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;