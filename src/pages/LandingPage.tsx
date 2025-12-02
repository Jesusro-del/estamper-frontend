import { useState } from "react";
import { ArrowRight, Package, Zap, Shield, TrendingUp, CheckCircle, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    const navigateToProducts = () => {
        if (typeof window !== 'undefined' && (window as any).navigateTo) {
            (window as any).navigateTo('products');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <img src="http://www.estamper.com/wp-content/uploads/2016/02/logo.png" alt="Estamper" className="h-8 w-auto" />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => scrollToSection("features")}
                                className="text-gray-600 hover:text-blue-800 transition-colors"
                            >
                                Servicios
                            </button>
                            <button
                                onClick={() => scrollToSection("benefits")}
                                className="text-gray-600 hover:text-blue-800 transition-colors"
                            >
                                Nosotros
                            </button>
                            <button
                                onClick={() => scrollToSection("cta")}
                                className="text-gray-600 hover:text-blue-800 transition-colors"
                            >
                                Contacto
                            </button>
                            <Button
                                onClick={navigateToProducts}
                                className="bg-blue-800 hover:bg-blue-900"
                            >
                                Acceder
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-600 hover:text-blue-800"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 space-y-2">
                            <button
                                onClick={() => scrollToSection("features")}
                                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Servicios
                            </button>
                            <button
                                onClick={() => scrollToSection("benefits")}
                                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Nosotros
                            </button>
                            <button
                                onClick={() => scrollToSection("cta")}
                                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Contacto
                            </button>
                            <Button
                                onClick={navigateToProducts}
                                className="w-full bg-blue-800 hover:bg-blue-900"
                            >
                                Acceder
                            </Button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-4 py-1">
                            Solución integral de gestión empresarial
                        </Badge>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                            Personalización e Impresión
                            <span className="block text-blue-800">a Tu Medida</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Transformamos tus ideas en productos únicos. Especialistas en impresión y personalización
                            de prendas, objetos promocionales y más.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                onClick={navigateToProducts}
                                className="bg-blue-800 hover:bg-blue-900 text-lg px-8 py-6 h-auto"
                            >
                                Acceder al Sistema
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => scrollToSection("features")}
                                className="text-lg px-8 py-6 h-auto border-2 border-blue-800 text-blue-800 hover:bg-blue-50"
                            >
                                Conocer Servicios
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image/Illustration */}
                    <Card className="mt-20 bg-gradient-to-r from-blue-100 to-blue-200 border-none shadow-2xl">
                        <CardContent className="p-8">
                            <Card className="shadow-lg">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 bg-blue-100 rounded"></div>
                                        <div className="h-8 bg-gray-100 rounded"></div>
                                        <div className="h-8 bg-gray-100 rounded"></div>
                                        <div className="h-8 bg-gray-100 rounded"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Nuestros Servicios
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Soluciones completas de personalización para empresas y particulares
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Package className="h-8 w-8 text-blue-800" />,
                                title: "Impresión en Ropa",
                                description: "Camisetas, gorras, sudaderas y más. Personalizamos cualquier prenda con tus diseños."
                            },
                            {
                                icon: <Zap className="h-8 w-8 text-blue-800" />,
                                title: "Productos Promocionales",
                                description: "Tazas, llaveros, libretas y artículos personalizados para tu empresa."
                            },
                            {
                                icon: <Shield className="h-8 w-8 text-blue-800" />,
                                title: "Alta Calidad",
                                description: "Técnicas avanzadas de impresión garantizando resultados duraderos y profesionales."
                            },
                            {
                                icon: <TrendingUp className="h-8 w-8 text-blue-800" />,
                                title: "Reportes Automáticos",
                                description: "Sistema de gestión que genera reportes de ventas en Excel instantáneamente."
                            }
                        ].map((feature, index) => (
                            <Card key={index} className="hover:shadow-xl transition-shadow border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                                <CardHeader>
                                    <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-2">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                ¿Por qué elegir ESTAMPER?
                            </h2>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-blue-800 mb-3">Nuestra Misión</h3>
                                <p className="text-lg text-gray-700">
                                    Ofrecer servicios de impresión de alta calidad, personalizados y sostenibles.
                                    Nos comprometemos a proporcionar soluciones rápidas y accesibles, asegurando una
                                    experiencia excelente para satisfacer las necesidades de negocios y particulares.
                                </p>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-blue-800 mb-3">Nuestra Visión</h3>
                                <p className="text-lg text-gray-700">
                                    Ser la imprenta de referencia a nivel local y regional, reconocida por nuestra calidad,
                                    innovación y compromiso con el cliente. Aspiramos a expandirnos estratégicamente
                                    manteniendo nuestros valores de sostenibilidad y excelencia.
                                </p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    "Reducción de tiempo en reportes de días a minutos",
                                    "Eliminación de errores manuales en gestión",
                                    "Identificación rápida de productos estrella",
                                    "Optimización de inventario basado en datos reales",
                                    "Mejor control de ingresos y márgenes",
                                    "Base sólida para expansión de sucursales"
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-lg text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Card className="bg-gradient-to-br from-blue-800 to-blue-900 border-none text-white shadow-2xl">
                            <CardContent className="p-8">
                                <div className="space-y-6">
                                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                        <CardContent className="p-6">
                                            <h3 className="text-2xl font-bold mb-2">Eficiencia</h3>
                                            <p className="text-blue-100">De días a minutos en reportes</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                        <CardContent className="p-6">
                                            <h3 className="text-2xl font-bold mb-2">Precisión</h3>
                                            <p className="text-blue-100">Cero errores manuales</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                        <CardContent className="p-6">
                                            <h3 className="text-2xl font-bold mb-2">Sostenible</h3>
                                            <p className="text-blue-100">Compromiso ambiental</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        ¿Listo para transformar tu negocio de personalización?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Únete a ESTAMPER y descubre cómo automatizar tu gestión, mejorar tus decisiones
                        y hacer crecer tu negocio con datos precisos y reportes instantáneos.
                    </p>
                    <Button
                        onClick={navigateToProducts}
                        className="bg-blue-800 hover:bg-blue-900 text-lg px-12 py-6 h-auto"
                    >
                        Acceder al Sistema
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <img src="http://www.estamper.com/wp-content/uploads/2016/02/logo.png" alt="Estamper" className="h-8 w-auto" />
                            </div>
                            <p className="text-gray-400">
                                Personalización e impresión de alta calidad para tu negocio.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Servicios</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white transition-colors">Impresión en Ropa</a></li>
                                <li><a href="#features" className="hover:text-white transition-colors">Productos Promocionales</a></li>
                                <li><button onClick={navigateToProducts} className="hover:text-white transition-colors">Sistema de Gestión</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Compañía</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Legal</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                            </ul>
                        </div>
                    </div>
                    <Separator className="my-8 bg-gray-800" />
                    <div className="text-center text-gray-400">
                        <p>&copy; 2025 ESTAMPER. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
