import { Table, TableBody, TableHead, TableHeadCell, TableRow, TableCell, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { HiInformationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { ProductRow } from "./productRow";
import { ProductFormModal } from "./productFormModal";
import type { Product } from "../types/Product";

const userRole = localStorage.getItem("userRole");

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");

function fetchProducts() {
  // api helper'ını bir kenara bırakıp direkt URL ile zorla:
  api.get("http://localhost:3000/products") 
     .then((res) => {
       console.log("BAŞARILI! Veri geldi:", res.data);
       setProducts(res.data);
       setError(""); 
     })
     .catch((err) => {
       console.error("Hatanın tam detayı:", err.response);
       // Eğer hala 404 geliyorsa backend'de ProductsController'ın 
       // AppModule'e eklenip eklenmediğini bir daha kontrol etmen gerekebilir.
       setError("Ürünler yüklenirken bir hata oluştu (404 Not Found)."); 
     });
}

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) {
      return <Alert color="failure" icon={HiInformationCircle}>{error}</Alert>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-10 max-w-5xl mx-auto">
      {/* Üst Header */}
      <header className="pb-6 bg-white lg:pb-0">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
             
              <nav className="flex items-center justify-between h-16 lg:h-20">
                  <div className="flex-shrink-0">
                      <a href="#" title="" className="flex">
                          <img className="w-auto h-8 lg:h-10" src="https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg" alt="" />
                      </a>
                  </div>
      
                  <button type="button" className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100">
                      
                      <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                      </svg>
      
                     
                      <svg className="hidden w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
      
                  <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10">
                      <a href="#" title="" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Ana Sayfa </a>
                      {userRole == "Admin" && (
                      <Link to="/profiletable" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> 
              Kullanıcı Ayarları 
          </Link>
                      )}
                      <Link to="/productTable" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> 
              Ürünler 
          </Link>
      
          {/* ÜRÜN EKLE LİNKİ (Bu da aynı sayfaya gitsin, orada modalı açarsın) */}
          <Link to="/productTable" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> 
              Ürün Ekle 
          </Link>
          </div>
                  
                          </nav>
              <nav className="pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md lg:hidden">
                  <div className="flow-root">
                      <div className="flex flex-col px-6 -my-2 space-y-1">
                          <a href="#" title="" className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Ana Sayfa </a>
                        {userRole == "Admin" && (
      <Link to="/profiletable" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> 
              Kullanıcı Ayarları 
          </Link>                  )}
                          <Link to="/productTable" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> 
              Ürünler 
          </Link>
      
          {/* ÜRÜN EKLE LİNKİ (Bu da aynı sayfaya gitsin, orada modalı açarsın) */}
          <Link to="/productTable" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> 
              Ürün Ekle 
          </Link>
          </div>
                  </div>
              </nav>
          </div>
      </header>

      <div className="flex justify-between items-center mb-4 mt-6">
        <h2 className="text-2xl font-bold text-gray-800">Ürün Yönetimi</h2>
        <ProductFormModal fetchProducts={fetchProducts} product={null} />
      </div>
      
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
  {/* Buraya bir Table.HeadRow veya normal bir tr eklemek Flowbite versiyonuna göre gerekebilir 
      ama en standart düzgün yapı şudur: */}
  <TableHeadCell>ID</TableHeadCell>
  <TableHeadCell>Ürün Adı</TableHeadCell>
  <TableHeadCell>Fiyat</TableHeadCell>
  <TableHeadCell>Ekleyen</TableHeadCell>
  <TableHeadCell>Kategoriler</TableHeadCell>
  <TableHeadCell>İşlemler</TableHeadCell>
</TableHead>
          <TableBody className="divide-y">
            {products.length > 0 ? (
                products.map((p) => (
                    <ProductRow key={p.id} fetchProducts={fetchProducts} product={p} />
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        Henüz kayıtlı ürün yok.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductTable;