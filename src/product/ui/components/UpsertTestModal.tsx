import type { FC } from "react";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../../components/ui/field";
import { CreateProduct, UpdateProduct } from "../../api/product.service";
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
    const [isPending, setIsPending] = useState(false);
    const pendingRef = useRef(false);

    // Cargar datos del producto al editar
    useEffect(() => {
        if (rest.action === "UPDATE" && rest.product) {
            setIdProduct(rest.product.idProduct);
            setNameProduct(rest.product.nameProduct);
            setStock(rest.product.Stock.toString());
        } else {
            // Limpiar formulario al crear
            setIdProduct("");
            setNameProduct("");
            setStock("");
        }
    }, [rest.action, rest.action === "UPDATE" ? rest.product : null]);

    const handleSubmit = async (e?: React.SyntheticEvent) => {
        e?.preventDefault();

        // Prevent duplicate/parallel submissions
        if (pendingRef.current) return;

        if (!nameProduct.trim() || !stock.trim()) {
            alert("Por favor complete todos los campos");
            return;
        }

        const stockNumber = parseInt(stock);
        if (isNaN(stockNumber) || stockNumber < 0) {
            alert("El stock debe ser un número válido");
            return;
        }

        if (rest.action === "CREATE" && !idProduct.trim()) {
            alert("Por favor ingrese el ID del producto");
            return;
        }

        setIsPending(true);
        pendingRef.current = true;

        try {
            if (rest.action === "CREATE") {
                await CreateProduct({
                    idProduct: idProduct.trim(),
                    nameProduct: nameProduct.trim(),
                    Stock: stockNumber,
                });
            } else {
                await UpdateProduct(rest.product.idProduct, {
                    idProduct: rest.product.idProduct,
                    nameProduct: nameProduct.trim(),
                    Stock: stockNumber,
                });
            }

            // Limpiar formulario
            setIdProduct("");
            setNameProduct("");
            setStock("");

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
            pendingRef.current = false;
            setIsPending(false);
        }
    };

    const handleCancel = () => {
        // Prevent cancelling while a request is in-flight
        if (pendingRef.current) return;

        setIdProduct("");
        setNameProduct("");
        setStock("");
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
                                </FieldGroup>
                            </FieldSet>
                            
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
                        type="button"
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