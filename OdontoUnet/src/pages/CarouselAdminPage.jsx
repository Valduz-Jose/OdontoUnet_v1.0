import { useState, useEffect } from 'react';
import { Upload, Trash2, Eye, Image as ImageIcon } from 'lucide-react';

function CarouselAdminPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/carousel', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Crear previews
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreview(previews);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('http://localhost:3000/api/carousel', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const newImages = await response.json();
        setImages(prev => [...prev, ...newImages]);
        setSelectedFiles([]);
        setPreview([]);
        // Limpiar input file
        document.getElementById('file-input').value = '';
        alert('Imágenes subidas correctamente');
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'No se pudieron subir las imágenes'));
      }
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert('Error al subir las imágenes');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/carousel/${imageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setImages(prev => prev.filter(img => img._id !== imageId));
        alert('Imagen eliminada correctamente');
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'No se pudo eliminar la imagen'));
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      alert('Error al eliminar la imagen');
    }
  };

  const clearPreviews = () => {
    preview.forEach(p => URL.revokeObjectURL(p.url));
    setPreview([]);
    setSelectedFiles([]);
    document.getElementById('file-input').value = '';
  };

  if (loading) {
    return <div className="text-center py-8">Cargando imágenes del carrusel...</div>;
  }

  return (
    <div className="min-h-screen bg-[#202020] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-500">Gestión del Carrusel</h1>
        
        {/* Sección de subida */}
        <div className="bg-zinc-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="mr-2" size={20} />
            Subir Nuevas Imágenes
          </h2>
          
          <div className="space-y-4">
            <div>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              <p className="text-gray-400 text-sm mt-2">
                Puedes seleccionar múltiples imágenes. Formatos soportados: JPG, PNG, WebP
              </p>
            </div>

            {/* Preview de imágenes seleccionadas */}
            {preview.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Vista previa:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {preview.map((item, index) => (
                    <div key={index} className="bg-zinc-800 p-2 rounded">
                      <img
                        src={item.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <p className="text-xs text-gray-400 mt-1 truncate">{item.name}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Subiendo...' : `Subir ${preview.length} imagen${preview.length > 1 ? 'es' : ''}`}
                  </button>
                  <button
                    onClick={clearPreviews}
                    className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Galería de imágenes actuales */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <ImageIcon className="mr-2" size={20} />
            Imágenes del Carrusel ({images.length})
          </h2>
          
          {images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-xl text-gray-400">No hay imágenes en el carrusel</p>
              <p className="text-gray-500">Sube algunas imágenes para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image._id} className="bg-zinc-800 rounded-lg overflow-hidden">
                  <div className="relative group">
                    <img
                      src={`http://localhost:3000/uploads/carousel/${image.filename}`}
                      alt={image.originalName}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Overlay con acciones */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                      <button
                        onClick={() => window.open(`http://localhost:3000/uploads/carousel/${image.filename}`, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
                        title="Ver imagen completa"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
                        title="Eliminar imagen"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-white font-medium truncate">{image.originalName}</p>
                    <div className="text-gray-400 text-sm mt-2">
                      <p>Subida: {new Date(image.uploadDate).toLocaleDateString()}</p>
                      <p>Tamaño: {(image.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="mt-8 bg-blue-900/30 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">💡 Recomendaciones</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Las imágenes deben tener una relación de aspecto 16:9 para mejor visualización</li>
            <li>• Tamaño recomendado: 1920x1080 píxeles</li>
            <li>• Peso máximo: 5MB por imagen</li>
            <li>• Las imágenes se mostrarán en el carrusel de la página principal</li>
            <li>• Puedes subir múltiples imágenes a la vez</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CarouselAdminPage;