import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Field, FieldGroup, FieldLabel } from "../components/ui/field";
import { Lock, Mail, AlertCircle } from "lucide-react";

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Validar credenciales
        if (email === "admin@estamper.com" && password === "admin123!" ||
            email === "gioaldave121@gmail.com" && password === "giovanni123!")
            {
            // Guardar sesión
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userEmail", email);

            setTimeout(() => {
                setIsLoading(false);
                onLoginSuccess();
            }, 500);
        } else {
            setTimeout(() => {
                setIsLoading(false);
                setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
            }, 800);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="http://www.estamper.com/wp-content/uploads/2016/02/logo.png"
                        alt="Estamper"
                        className="h-16 w-auto mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-900">Sistema de Gestión</h1>
                    <p className="text-gray-600 mt-2">Acceso exclusivo para administradores</p>
                </div>

                {/* Login Card */}
                <Card className="shadow-xl border-blue-100">
                    <CardHeader>
                        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                        <CardDescription>
                            Ingresa tus credenciales para acceder al sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">
                                        <Mail className="inline h-4 w-4 mr-2" />
                                        Correo Electrónico
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@estamper.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-1"
                                        disabled={isLoading}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="password">
                                        <Lock className="inline h-4 w-4 mr-2" />
                                        Contraseña
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="mt-1"
                                        disabled={isLoading}
                                    />
                                </Field>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-800 hover:bg-blue-900 mt-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Verificando..." : "Ingresar"}
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        ¿Problemas para acceder? Contacta al administrador del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
}
