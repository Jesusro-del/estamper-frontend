import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE = "https://a2lum56xy0.execute-api.us-east-1.amazonaws.com";

// Tipos
interface PresignRespDTO {
    uploadUrl: string;
}

// Funciones de API
const presignUpload = async (
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

const uploadToS3 = async (uploadUrl: string, file: File) => {
    const r = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
    });
    if (!r.ok) throw new Error(`PUT S3 ${r.status}`);
};

// Función combinada
const uploadFileForProduct = async (idProduct: string, file: File) => {
    // 1. Obtener URL prefirmada
    const presignData = await presignUpload(idProduct, file);

    // 2. Subir archivo a S3
    await uploadToS3(presignData.uploadUrl, file);
};

// Componente
export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus('error');
            setMessage('Por favor selecciona un archivo');
            return;
        }

        setLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            await uploadFileForProduct('M40', file);
            setStatus('success');
            setMessage(`Archivo "${file.name}" subido exitosamente`);
            setFile(null);
            // Reset input
            const input = document.getElementById('file-input') as HTMLInputElement;
            if (input) input.value = '';
        } catch (error) {
            setStatus('error');
            setMessage(`Error al subir archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                        <Upload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Subir Archivo
                    </h1>
                    <p className="text-gray-600">
                        Producto ID: <span className="font-semibold text-indigo-600">M40</span>
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Input de archivo */}
                    <div>
                        <label
                            htmlFor="file-input"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Seleccionar archivo
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                cursor-pointer"
                        />
                        {file && (
                            <p className="mt-2 text-sm text-gray-600">
                                Archivo seleccionado: <span className="font-medium">{file.name}</span>
                            </p>
                        )}
                    </div>

                    {/* Botón de carga */}
                    <button
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold
              hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors duration-200"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Subir a S3
                            </>
                        )}
                    </button>

                    {/* Mensajes de estado */}
                    {status === 'success' && (
                        <div className="flex items-start gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-800">{message}</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-md">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}