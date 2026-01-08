import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, FileInput, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { showErrors } from "../helper/helper";
import type { Profile, ProfileType } from "../types/Profile";
import { FaEdit, FaPlus } from "react-icons/fa";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
  fetchProfiles: () => void;
  profile: Profile | null;
}

export const ProfileFormModal = ({ fetchProfiles, profile }: Props) => {
  const [show, setShow] = useState(false);
  
  // --- KRİTİK DÜZELTME BURADA ---
  // Eski kod direkt profile.username diyordu. profile?.username diyerek hata almayı engelledik.
  const [username, setUsername] = useState(profile?.username || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // EN ÖNEMLİ DÜZELTME:
  // profileType null ise ID okumaya çalışma, boş string ata.
  // Bu sayede sayfa "Cannot read properties of null" hatası verip çökmez.
  const [profileTypeId, setProfileTypeId] = useState(
    (profile && profile.profileType && profile.profileType.id) 
      ? profile.profileType.id.toString() 
      : ""
  );

  const [file, setFile] = useState<File | null>(null);
  const [types, setTypes] = useState<ProfileType[]>([]);

  // Modal her açıldığında verileri state'e yeniden yükle (Senkronizasyon)
  useEffect(() => {
    if (show) {
      if (profile) {
        setUsername(profile.username || "");
        setEmail(profile.email || "");
        // Burada da koruma ekledik
        setProfileTypeId(profile.profileType?.id ? profile.profileType.id.toString() : "");
      } else {
        // Yeni kayıt ise temizle
        setUsername("");
        setEmail("");
        setProfileTypeId("");
      }
      // Şifre ve dosya her zaman boş başlar
      setPassword("");
      setConfirmPassword("");
      setFile(null);

      api.get("profileTypes")
         .then((res) => setTypes(res.data))
         .catch((err) => console.error("Tipler çekilemedi", err));
    }
  }, [show, profile]);
  function dontsave() {
    setShow(false);
  }
  function handleSave() {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("profileTypeId", profileTypeId);

    if (password) formData.append("password", password);
    if (confirmPassword) formData.append("confirmPassword", confirmPassword);

    if (file) {
      formData.append("photo", file);
    }

    if (profile) {
      // GÜNCELLEME (PATCH)
      api.patch(`profiles/${profile.id}`, formData)
        .then(() => {
          fetchProfiles();
          toast.success("Profil güncellendi");
          setShow(false);
        })
        .catch((error) => showErrors(error));
    } else {
      // OLUŞTURMA (POST)
      api.post("profiles", formData)
        .then(() => {
          fetchProfiles();
          toast.success("Profil oluşturuldu");
          // Başarılı olursa formu temizle
          setUsername(""); setEmail(""); setPassword(""); setConfirmPassword(""); setProfileTypeId(""); setFile(null);
          setShow(false);
        })
        .catch((error) => showErrors(error));
    }
  }

  function getButton() {
    if (profile == null)
      return (
        <Button className="ml-auto mb-2" onClick={() => setShow(true)}>
          <FaPlus className="mr-2"/> Yeni Profil
        </Button>
      );
    return (
      <Button size="xs" color="success" onClick={() => setShow(true)}>
        <FaEdit />
      </Button>
    );
  }

  return (
    <>
      <div className="flex">{getButton()}</div>
      <Modal show={show} size="md" onClose={() => setShow(false)} popup>
        <ModalHeader>
          <h3 className="ml-4 mt-2 text-lg">{profile == null ? "Yeni Profil Ekle" : "Profili Güncelle"}</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-x-16">
              <Button onClick={dontsave} className="w-full mt-4">Guncellemeden kapat</Button>
          </div>
          <div className="space-y-4">
            {/* Kullanıcı Adı */}
            <div>
              <div className="mb-1 block"><Label>Kullanıcı Adı</Label></div>
              <TextInput value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            {/* Email */}
            <div>
              <div className="mb-1 block"><Label>email</Label></div>
              <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Profil Tipi (SELECT) */}
            <div>
               <div className="mb-1 block"><Label>Profil Tipi</Label></div>
               <Select value={profileTypeId} onChange={(e) => setProfileTypeId(e.target.value)}>
                  <option value="">Seçiniz...</option>
                  {types.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
               </Select>
            </div>

            {/* Şifre Alanları */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <div className="mb-1 block"><Label>Şifre</Label></div>
                    <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <div className="mb-1 block"><Label>Tekrar</Label></div>
                    <TextInput type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
            </div>

            {/* Dosya Yükleme */}
            <div>
                <div className="mb-1 block"><Label>Fotoğraf</Label></div>
                <FileInput onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
            </div>

            <Button onClick={handleSave} className="w-full mt-4">Kaydet</Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};