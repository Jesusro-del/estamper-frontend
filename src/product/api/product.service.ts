import type { PresignRespDTO } from "../dto/CreateProductDTO";
import type { ResponseProductsDTO } from "../dto/ResponseProductsDTO";

// Listar productos del catálogo con fetch
export const GetProducts = async (): Promise<ResponseProductsDTO[]> => {
  const response = await fetch(
    "https://a2lum56xy0.execute-api.us-east-1.amazonaws.com/mis-productos",
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status}`);
  }

  const data: ResponseProductsDTO[] = await response.json();
  return data;
};

export const GetProduct = async (
  idProduct: string
): Promise<ResponseProductsDTO> => {
  const response = await fetch(
    `https://a2lum56xy0.execute-api.us-east-1.amazonaws.com/producto/${idProduct}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status}`);
  }

  const data: ResponseProductsDTO = await response.json();
  return data;
};

interface CreateProductDTO {
  idProduct: string;
  nameProduct: string;
  Stock: number;
}

const API_BASE = "https://a2lum56xy0.execute-api.us-east-1.amazonaws.com";

export const presignUpload = async (
  idProduct: string,
  file: File
): Promise<PresignRespDTO> => {
  const r = await fetch(`${API_BASE}/presign-upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idProduct,
      filename: file.name,
      contentType: file.type || "application/octet-stream",
    }),
  });
  if (!r.ok) throw new Error(`presign-upload ${r.status}`);
  return r.json();
};

export const uploadToS3 = async (uploadUrl: string, file: File) => {
  const r = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!r.ok) throw new Error(`PUT S3 ${r.status}`);
};

export const CreateProduct = async (data: CreateProductDTO) => {
  const r = await fetch(`${API_BASE}/producto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(`createProduct ${r.status}`);
  return r.json();
};
// export const CreateProduct = async (
//   data: CreateProductDTO
// ): Promise<ResponseProductsDTO> => {
//   const response = await fetch(
//     "https://a2lum56xy0.execute-api.us-east-1.amazonaws.com/producto",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Error al crear producto: ${response.status}`);
//   }

//   const created: ResponseProductsDTO = await response.json();
//   return created;
// };

interface UpdateProductDTO {
  idProduct: string;
  nameProduct: string;
  Stock: number;
}

export const UpdateProduct = async (
  idProduct: string,
  data: UpdateProductDTO
): Promise<ResponseProductsDTO> => {
  const response = await fetch(
    `https://a2lum56xy0.execute-api.us-east-1.amazonaws.com/producto/${idProduct}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Error al actualizar producto: ${response.status}`);
  }

  const update: ResponseProductsDTO = await response.json();
  return update;
};
