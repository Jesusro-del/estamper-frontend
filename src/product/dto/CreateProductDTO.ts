export interface PresignRespDTO {
  uploadUrl: string;
  image: {
    bucket: string;
    key: string;
    filename: string;
    contentType: string;
    region: string;
  };
}

export interface CreateProductDTO {
  idProduct: string;
  nameProduct: string;
  Stock: number;
  image?: PresignRespDTO["image"];
}
