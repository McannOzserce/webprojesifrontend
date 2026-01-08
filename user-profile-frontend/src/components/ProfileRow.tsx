import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import type { Profile } from "../types/Profile";
import { ProfileFormModal } from "./ProfileFormModal";
import { FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
  fetchProfiles: () => void;
  profile: Profile;
}

export const ProfileRow = ({ fetchProfiles, profile }: Props) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    // Fragment (<>...</>) kaldırıldı, direkt <tr> ile başlıyoruz
    <tr className="bg-white border-b hover:bg-gray-50 text-gray-900">
      <td className="px-6 py-4 font-medium">{profile.id}</td>
      
      <td className="px-6 py-4">
          <img 
              src={profile.photo} 
              alt="Profil" 
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
      </td>

      <td className="px-6 py-4">{profile.username}</td>
      <td className="px-6 py-4">{profile.email}</td>

      <td className="px-6 py-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {profile.profileType?.name || " - "}
          </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex gap-2">
          {/* Güncelleme Modalı */}
          <ProfileFormModal fetchProfiles={fetchProfiles} profile={profile} />
          
          {/* Silme Butonu */}
          <Button size="xs" color="failure" onClick={() => setShowDelete(true)}>
            <FaTrash />
          </Button>

          {/* DÜZELTME: Silme Modalı'nı buraya, TD'nin içine taşıdık */}
          <Modal show={showDelete} size="md" onClose={() => setShowDelete(false)} popup>
            <ModalHeader />
            <ModalBody>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
                <h3 className="mb-5 text-lg font-normal text-gray-500">
                  Silmek istediğine emin misin?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={() => {
                      api.delete(`profiles/${profile.id}`)
                        .then(() => {
                          fetchProfiles();
                          setShowDelete(false);
                          toast.success("Silindi!");
                        })
                        .catch(() => toast.error("Hata oluştu"));
                    }}>
                    Evet, Sil
                  </Button>
                  <Button color="gray" onClick={() => setShowDelete(false)}>İptal</Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </td>
    </tr>
  );
};