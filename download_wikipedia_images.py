#!/usr/bin/env python3
import requests
import os
import re
from urllib.parse import urlparse

# Lista de lugares turísticos con sus imágenes de Wikipedia Commons
places = {
    "Sagrada Familia": {
        "base_url": "https://commons.wikimedia.org/wiki/Sagrada_Fam%C3%ADlia?uselang=es",
        "files": [
            "https://commons.wikimedia.org/wiki/File:Sagrada_Familia_03.jpg",
            "https://commons.wikimedia.org/wiki/File:Exterior_Sagrada_Familia2.jpg",
            "https://commons.wikimedia.org/wiki/File:Sagrada_Familia_June_2019.jpg",
            "https://commons.wikimedia.org/wiki/File:050529_Barcelona_026.jpg"
        ]
    },
    "Alhambra": {
        "base_url": "https://commons.wikimedia.org/wiki/Alhambra?uselang=es",
        "files": [
            "https://commons.wikimedia.org/wiki/File:Alhambra_01.jpg",
            "https://commons.wikimedia.org/wiki/File:Alhambra_02.jpg",
            "https://commons.wikimedia.org/wiki/File:Alhambra_03.jpg"
        ]
    },
    "Park Güell": {
        "base_url": "https://commons.wikimedia.org/wiki/Parc_G%C3%BCell?uselang=es",
        "files": [
            "https://commons.wikimedia.org/wiki/File:Parc_G%C3%BCell_01.jpg",
            "https://commons.wikimedia.org/wiki/File:Parc_G%C3%BCell_02.jpg",
            "https://commons.wikimedia.org/wiki/File:Parc_G%C3%BCell_03.jpg"
        ]
    },
    "Casa del Guarda": {
        "base_url": "https://commons.wikimedia.org/wiki/Casa_del_Guarda?uselang=es",
        "files": [
            "https://commons.wikimedia.org/wiki/File:Casa_del_Guarda_01.jpg",
            "https://commons.wikimedia.org/wiki/File:Casa_del_Guarda_02.jpg"
        ]
    },
    "Playa de la Concha": {
        "base_url": "https://commons.wikimedia.org/wiki/Playa_de_la_Concha?uselang=es",
        "files": [
            "https://commons.wikimedia.org/wiki/File:Playa_de_la_Concha_01.jpg",
            "https://commons.wikimedia.org/wiki/File:Playa_de_la_Concha_02.jpg"
        ]
    },
    "Teide": {
        "base_url": "https://commons.wikimedia.org/wiki/Teide?uselang=es",
        "files": [
            "https://commons.wikimedia.org/wiki/File:Teide_01.jpg",
            "https://commons.wikimedia.org/wiki/File:Teide_02.jpg"
        ]
    },
    "Catedral de Burgos": {
        "base_url": "https://commons.wikimedia.org/wiki/Catedral_de_Burgos?uselang=es",
        "files": [
            "https://commons.wikimedia.org/wiki/File:Catedral_de_Burgos_01.jpg",
            "https://commons.wikimedia.org/wiki/File:Catedral_de_Burgos_02.jpg"
        ]
    }
}

def download_image(url, filename):
    """Descargar imagen desde URL con licencia permisiva"""
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
    """Descargar imágenes de Wikipedia Commons con licencias permisivas"""
    print("🚀 Iniciando descarga de imágenes de Wikipedia Commons...")
    
    success_count = 0
    
    for place_name, place_data in places.items():
        print(f"\n📁 Descargando imágenes de {place_name}...")
        
        for i, file_url in enumerate(place_data["files"], 1):
            # Extraer nombre de archivo de la URL
            parsed_url = urlparse(file_url)
            path_parts = parsed_url.path.split('/')
            filename = f"{place_name.lower().replace(' ', '_').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o')}_{i:02d}.jpg"
            
            if download_image(file_url, filename):
                success_count += 1
                print(f"  ✅ {filename}")
            else:
                print(f"  ❌ Error descargando {filename}")
    
    print(f"\n🎯 Descarga completada: {success_count}/{sum(len(place['files']) for place in places.values())} imágenes")
    print("📁 Las imágenes se han guardado en la carpeta 'images/lugares/'")
    print("🌐 Ahora puedes usar estas URLs en el código de Spainly")

if __name__ == "__main__":
    main()
