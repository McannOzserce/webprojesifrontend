import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { api } from "../helper/api";
import { showErrors } from "../helper/helper";
import { toast } from "sonner";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    api.post("auth/login", { email, password })
      .then((res) => {
        // Backend'den gelen kritik bilgileri sakla
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.id); // ARTIK ID KAYDEDİLİYOR
        localStorage.setItem("userRole", res.data.profileType?.name || "User");
        
        toast.success("Giriş başarılı!");

        setTimeout(() => { 
          window.location.href = "/profiletable"; 
        }, 1000);
      })
      .catch((error) => {
        showErrors(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white text-center">Giriş Yap</h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">E-posta</Label>
              <TextInput id="email" type="email" placeholder="ornek@mail.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Şifre</Label>
              <TextInput id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading} color="blue">
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;