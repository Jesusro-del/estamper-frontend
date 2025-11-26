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


export const CreateProduct = async (idProduct:string): Promise<ResponseProductsDTO> => {
  const response = await fetch(
    `https://a2lum56xy0.execute-api.us-east-1.amazonaws.com/producto/${idProduct}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status}`);
  }

  const data: ResponseProductsDTO = await response.json();
  return data;
};