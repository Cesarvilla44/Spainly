#!/usr/bin/env python3
import requests
import os
from urllib.parse import urlparse

# Lista de lugares turísticos con sus imágenes de Unsplash (más permisivo)
places = {
    "Sagrada Familia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200",
    "Alhambra": "https://images.unsplash.com/photo-1545243424-049e-435d-9a569e26a05b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200",
    "Park Güell": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200",
    "Casa del Guarda": "https://images.unsplash.com/photo-1552828213-637d-9a4f-0f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200",
    "Playa de la Concha": "https://images.unsplash.com/photo-1552832736-637d-9a4f-0f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200",
    "Teide": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200",
    "Catedral de Burgos": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200"
}

def download_image(url, filename):
    """Descargar imagen desde URL"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Crear directorio si no existe
        os.makedirs('images/lugares', exist_ok=True)
        
        # Guardar imagen
        with open(f'images/lugares/{filename}', 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"✅ Descargada: {filename}")
        return True
        
    except Exception as e:
        print(f"❌ Error descargando {filename}: {e}")
        return False

def main():
    """Descargar todas las imágenes de los lugares turísticos"""
    print("🚀 Iniciando descarga de imágenes de lugares turísticos...")
    
    success_count = 0
    
    for place_name, url in places.items():
        # Generar nombre de archivo seguro
        filename = f"{place_name.lower().replace(' ', '_').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o')}.jpg"
        
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n🎯 Descarga completada: {success_count}/{len(places)} imágenes")
    print("📁 Las imágenes se han guardado en la carpeta 'images/lugares/'")
    print("🌐 Ahora puedes usar estas URLs en el código de Spainly")

if __name__ == "__main__":
    main()
