import type { FC } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../../components/ui/field";

type UpsertTestModal = (
    | {
        action: "CREATE";
    }
    | {
        action: "UPDATE";
    }
) & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const UpsertTestModal: FC<UpsertTestModal> = ({
    open,
    onOpenChange,
    ...rest
}) => {

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
                    <form>
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    {rest.action === "CREATE" && (
                                        <Field>
                                            <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                                Id Producto
                                            </FieldLabel>
                                            <Input
                                                id="checkout-7j9-card-name-43j"
                                                placeholder="P-01"
                                                required
                                            />
                                        </Field>)
                                    }
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                            Nombre Producto:
                                        </FieldLabel>
                                        <Input
                                            id="checkout-7j9-card-number-uw1"
                                            placeholder="1234 5678 9012 3456"
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                            Stock:
                                        </FieldLabel>
                                        <Input
                                            id="checkout-7j9-card-number-uw1"
                                            placeholder="1234 5678 9012 3456"
                                            required
                                        />
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                            <Field orientation="horizontal">
                                <Button type="submit">Submit</Button>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </div>
                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="text-gray-700 hover:bg-gray-100 border-gray-300"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-blue-800 hover:bg-blue-900 text-white"
                    // onClick={() => {
                    //     if (formRef.current) {
                    //         formRef.current.requestSubmit();
                    //     }
                    // }}
                    // disabled={isPending}
                    >
                        {rest.action === "CREATE" ? "Crear" : "Actualizar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};