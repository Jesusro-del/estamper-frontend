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


export const GetProduct = async (idProduct:string): Promise<ResponseProductsDTO> => {
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


export const CreateProduct = async (
  data: CreateProductDTO
): Promise<ResponseProductsDTO> => {
  const response = await fetch(
    "https://a2lum56xy0.execute-api.us-east-1.amazonaws.com/producto",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Error al crear producto: ${response.status}`);
  }

  const created: ResponseProductsDTO = await response.json();
  return created;
};

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
