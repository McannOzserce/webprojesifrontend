import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { showErrors } from "../helper/helper";
import type { Product, Category } from "../types/Product";
import { FaEdit, FaPlus } from "react-icons/fa";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
  fetchProducts: () => void;
  product: Product | null;
}

export const ProductFormModal = ({ fetchProducts, product }: Props) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  useEffect(() => {
    if (show) {
      setName(product?.name || "");
      setPrice(product?.price?.toString() || "");
      setSelectedCategoryIds(product?.categories?.map(c => c.id.toString()) || []);

      api.get("products/categories") 
         .then((res) => setCategories(res.data))
         .catch((err) => console.error("Kategoriler çekilemedi", err));
    }
  }, [show, product]);

  const handleSave = () => {
    // Okul projesi olduğu için en basit yöntemle ID alıyoruz
    const userJson = localStorage.getItem("user");
    const userId = userJson ? JSON.parse(userJson).id : localStorage.getItem("userId");

    const data = {
      name,
      price: parseFloat(price),
      categoryIds: selectedCategoryIds,
      profileId: userId, 
    };

    if (product) {
      api.patch(`products/${product.id}`, data)
        .then(() => { fetchProducts(); toast.success("Ürün güncellendi"); setShow(false); })
        .catch((error) => showErrors(error));
    } else {
      api.post("products", data)
        .then(() => { fetchProducts(); toast.success("Ürün eklendi"); setShow(false); })
        .catch((error) => showErrors(error));
    }
  };

  return (
    <>
      <Button color={product ? "success" : "blue"} size={product ? "xs" : "md"} onClick={() => setShow(true)}>
        {product ? <FaEdit /> : <><FaPlus className="mr-2"/> Yeni Ürün</>}
      </Button>

      <Modal show={show} size="md" onClose={() => setShow(false)} popup>
        <ModalHeader>
          <h3 className="ml-4 mt-2 text-lg">{product == null ? "Yeni Ürün Ekle" : "Ürünü Güncelle"}</h3>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div>
            <Label>Ürün Adı</Label>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Fiyat (TL)</Label>
            <TextInput type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <Label>Kategoriler (Çoklu Seçim: CTRL + Tık)</Label>
            <Select 
              multiple 
              className="h-32"
              value={selectedCategoryIds} 
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedCategoryIds(values);
              }}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <Button onClick={handleSave} className="w-full">Kaydet</Button>
        </ModalBody>
      </Modal>
    </>
  );
};