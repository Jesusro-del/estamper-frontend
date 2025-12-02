import type { FC } from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../../components/ui/field";
import { CreateProduct, UpdateProduct, presignUpload, uploadToS3 } from "../../api/product.service";
import type { ResponseProductsDTO } from "../../dto/ResponseProductsDTO";

type UpsertTestModal = (
    | {
        action: "CREATE";
    }
    | {
        action: "UPDATE";
        product: ResponseProductsDTO;
    }
) & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
};

export const UpsertTestModal: FC<UpsertTestModal> = ({
    open,
    onOpenChange,
    ...rest
}) => {
    const [idProduct, setIdProduct] = useState("");
    const [nameProduct, setNameProduct] = useState("");
    const [stock, setStock] = useState("");
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");

    // Cargar datos del producto al editar
    useEffect(() => {
        if (rest.action === "UPDATE" && rest.product) {
            setIdProduct(rest.product.idProduct);
            setNameProduct(rest.product.nameProduct);
            setStock(rest.product.Stock.toString());
            setImageFiles(null);
        } else {
            // Limpiar formulario al crear
            setIdProduct("");
            setNameProduct("");
            setStock("");
            setImageFiles(null);
        }
    }, [rest.action, rest.action === "UPDATE" ? rest.product : null]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFiles(e.target.files);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nameProduct.trim() || !stock.trim()) {
            alert("Por favor complete todos los campos");
            return;
        }

        const stockNumber = parseInt(stock);
        if (isNaN(stockNumber) || stockNumber < 0) {
            alert("El stock debe ser un número válido");
            return;
        }

        setIsPending(true);
        setUploadStatus("");

        try {
            const productId = rest.action === "CREATE" ? idProduct.trim() : rest.product.idProduct;

            if (rest.action === "CREATE" && !idProduct.trim()) {
                alert("Por favor ingrese el ID del producto");
                setIsPending(false);
                return;
            }

            // Manejar carga de imágenes si hay archivos seleccionados
            let imageMetadata = undefined;
            if (imageFiles && imageFiles.length > 0) {
                const file = imageFiles[0]; // Tomar la primera imagen

                try {
                    setUploadStatus("Preparando imagen...");
                    // 1. Obtener URL pre-firmada y metadata
                    const presignResp = await presignUpload(productId, file);

                    setUploadStatus("Subiendo imagen a S3...");
                    // 2. Subir archivo a S3
                    await uploadToS3(presignResp.uploadUrl, file);

                    setUploadStatus("Imagen cargada exitosamente");
                    // 3. Preparar metadata de la imagen para DynamoDB
                    imageMetadata = {
                        bucket: presignResp.image.bucket,
                        key: presignResp.image.key,
                        filename: presignResp.image.filename,
                        contentType: presignResp.image.contentType,
                        region: presignResp.image.region
                    };

                    console.log("Metadata de imagen preparada:", imageMetadata);
                } catch (uploadError) {
                    console.error("Error al subir imagen:", uploadError);
                    setUploadStatus("");
                    alert("Error al subir la imagen. El producto se guardará sin imagen.");
                }
            }

            setUploadStatus(rest.action === "CREATE" ? "Creando producto..." : "Actualizando producto...");

            // Preparar datos del producto
            const productData = {
                idProduct: productId,
                nameProduct: nameProduct.trim(),
                Stock: stockNumber,
                ...(imageMetadata && { image: imageMetadata })
            };

            console.log("Datos del producto a enviar:", productData);

            // Crear o actualizar producto
            if (rest.action === "CREATE") {
                await CreateProduct(productData);
            } else {
                await UpdateProduct(productId, productData);
            }

            // Limpiar formulario
            setIdProduct("");
            setNameProduct("");
            setStock("");
            setImageFiles(null);
            setUploadStatus("");

            // Llamar callback de éxito
            if (rest.onSuccess) {
                rest.onSuccess();
            }

            // Cerrar modal
            onOpenChange(false);
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert(`Error al ${rest.action === "CREATE" ? "crear" : "actualizar"} producto`);
        } finally {
            setIsPending(false);
        }
    };

    const handleCancel = () => {
        setIdProduct("");
        setNameProduct("");
        setStock("");
        setImageFiles(null);
        setUploadStatus("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-11/12">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {rest.action === "CREATE" ? "Nuevo Producto" : "Editar Producto"}
                    </DialogTitle>
                    <DialogDescription>
                        Llene los siguientes datos para{" "}
                        {rest.action === "CREATE" ? "crear" : "actualizar"} el producto.
                    </DialogDescription>
                </DialogHeader>
                {/**formulario */}
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    {rest.action === "CREATE" && (
                                        <Field>
                                            <FieldLabel htmlFor="idProduct">
                                                Id Producto
                                            </FieldLabel>
                                            <Input
                                                id="idProduct"
                                                placeholder="P-01"
                                                value={idProduct}
                                                onChange={(e) => setIdProduct(e.target.value)}
                                                required
                                            />
                                        </Field>)
                                    }
                                    <Field>
                                        <FieldLabel htmlFor="nameProduct">
                                            Nombre Producto:
                                        </FieldLabel>
                                        <Input
                                            id="nameProduct"
                                            placeholder="Nombre del producto"
                                            value={nameProduct}
                                            onChange={(e) => setNameProduct(e.target.value)}
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="stock">
                                            Stock:
                                        </FieldLabel>
                                        <Input
                                            id="stock"
                                            type="number"
                                            placeholder="100"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            min="0"
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="images">
                                            Imagen(es):
                                        </FieldLabel>
                                        <Input
                                            id="images"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="cursor-pointer"
                                        />
                                        {imageFiles && imageFiles.length > 0 && (
                                            <div className="mt-2 text-sm text-muted-foreground">
                                                <p className="font-medium">Archivos seleccionados:</p>
                                                <ul className="list-disc list-inside">
                                                    {Array.from(imageFiles).map((file, idx) => (
                                                        <li key={idx}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </Field>
                                </FieldGroup>
                            </FieldSet>

                            {uploadStatus && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                                    <p className="text-sm text-blue-700 font-medium">{uploadStatus}</p>
                                </div>
                            )}

                            <Field orientation="horizontal">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Procesando..." : (rest.action === "CREATE" ? "Crear" : "Actualizar")}
                                </Button>
                                <Button variant="outline" type="button" onClick={handleCancel} disabled={isPending}>
                                    Cancelar
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </div>
                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isPending}
                        className="text-gray-700 hover:bg-gray-100 border-gray-300"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-blue-800 hover:bg-blue-900 text-white"
                        onClick={handleSubmit}
                        disabled={isPending}
                    >
                        {isPending ? "Procesando..." : (rest.action === "CREATE" ? "Crear" : "Actualizar")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};