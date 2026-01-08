import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import type { Product } from "../types/Product";
import { ProductFormModal } from "./productFormModal";
import { FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
  fetchProducts: () => void;
  product: Product;
}

export const ProductRow = ({ fetchProducts, product }: Props) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <tr className="bg-white border-b hover:bg-gray-50 text-gray-900">
      <td className="px-6 py-4 font-medium">{product.id}</td>
      <td className="px-6 py-4 font-bold">{product.name}</td>
      <td className="px-6 py-4 text-green-600 font-semibold">{product.price} TL</td>
      <td className="px-6 py-4 text-sm">{product.addedBy?.username || "Bilinmiyor"}</td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {product.categories?.map((cat) => (
            <span key={cat.id} className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
              {cat.name}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <ProductFormModal fetchProducts={fetchProducts} product={product} />
          <Button size="xs" color="failure" onClick={() => setShowDelete(true)}>
            <FaTrash />
          </Button>

          <Modal show={showDelete} size="md" onClose={() => setShowDelete(false)} popup>
            <ModalHeader />
            <ModalBody>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
                <h3 className="mb-5 text-lg font-normal text-gray-500">Bu ürünü silmek istediğine emin misin?</h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={() => {
                      api.delete(`products/${product.id}`)
                        .then(() => {
                          fetchProducts();
                          setShowDelete(false);
                          toast.success("Ürün silindi!");
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